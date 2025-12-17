let elList = document.querySelector(".list")
let elMessegForm = document.querySelector(".message-form")
let elChooseImg = document.querySelector(".img-inp")

let messageList = get("message") || []

// Stroge save start
function set(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
}

function get(key) {
    try {
        return JSON.parse(localStorage.getItem(key))
    } catch {
        return []
    }
}
// Stroge save end

// Render message start
function renderMesseng(arr, list) {
    list.innerHTML = ""
    arr.forEach(item => {
        let elItem = document.createElement("li")
        if (item.image) {
            elItem.innerHTML = `
            <li class="bg-[#0088cc] relative message-item ml-auto p-2 rounded-tl-[18px] rounded-bl-[18px] rounded-tr-[15px] text-white text-shadow-md  text-[16px] w-[80%]">
                <img class="w-full rounded-[18px]" src="${item.image}" alt="Img">
                <p>${item.content}</p>
                <div class="text-end text-[12px]">
                    <span>${item.createAt}</span>
                </div>
            </li>
            `
        } else {
            elItem.innerHTML = `
            <li class="bg-[#0088cc] relative message-item ml-auto p-2 rounded-tl-[18px] rounded-bl-[18px] rounded-tr-[15px] text-white text-shadow-md  text-[16px] w-[80%]">
                <p>${item.content}</p>
                <div class="text-end text-[12px]">
                    <span>${item.createAt}</span>
                </div>
            </li>
            `
        
        }
        if (item.audio) {
            elItem.innerHTML = `
            <li class="bg-[#0088cc] ml-auto p-2 rounded-[18px] text-white w-[80%]">
                <audio controls class="w-full">
                    <source src="${item.audio}" type="audio/webm">
                </audio>
                <div class="text-end text-[12px]">
                    <span>${item.createAt}</span>
                </div>
            </li>
            `
        }
        list.appendChild(elItem)
    })
}

renderMesseng(messageList, elList)
// Render message end

// Choose img start
let imgUrl = null
elChooseImg.addEventListener("change", (evt) => {
    imgUrl = URL.createObjectURL(evt.target.files[0])
})
// Choose img end

// Submit message start
elMessegForm.addEventListener("submit", (evt) => {
    evt.preventDefault()
    let date = new Date()
    let time = `${date.toString().split(" ")[4].split(":")[0]}:${date.toString().split(" ")[4].split(":")[1]}`

    const data = {
        id: messageList.length ? messageList[messageList.length - 1].id + 1 : 1,
        image: imgUrl,
        content: evt.target.message.value,
        createAt: time,
    }

    messageList.push(data)
    set("message", messageList)
    renderMesseng(messageList, elList)

    imgUrl = null
    evt.target.reset()
})
// Submit message end
let micBtn = document.querySelector("#micBtn")
let mediaRecorder
let audioChunks = []


micBtn.addEventListener("click", async () => {
    if (!mediaRecorder || mediaRecorder.state === "inactive") {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        mediaRecorder = new MediaRecorder(stream)
        audioChunks = []

        mediaRecorder.ondataavailable = e => {
            audioChunks.push(e.data)
        }

        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: "audio/webm" })
            const audioUrl = URL.createObjectURL(audioBlob)

            let date = new Date()
            let time = `${date.getHours()}:${date.getMinutes()}`

            const data = {
                id: messageList.length ? messageList.at(-1).id + 1 : 1,
                audio: audioUrl,
                content: "",
                createAt: time
            }

            messageList.push(data)
            set("message", messageList)
            renderMesseng(messageList, elList)
        }

        mediaRecorder.start()
        micBtn.classList.add("opacity-50")
    } else {
        mediaRecorder.stop()
        micBtn.classList.remove("opacity-50")
    }
})


