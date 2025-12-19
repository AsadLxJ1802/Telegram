let elList = document.querySelector(".list")
let elMessegForm = document.querySelector(".message-form")
let elChooseImg = document.querySelector(".img-inp")
let elCamBtn = document.querySelector(".camera-btn")

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
        elItem.className = "ml-auto w-[80%]"

        if (item.image) {
            elItem.innerHTML = `
                <div class="bg-[#0088cc] p-2 rounded-[18px] text-white">
                    <img src="${item.image}" class="w-full rounded-[12px]" />
                    <p>${item.content}</p>
                    <div class="text-end text-[12px]">${item.createAt}</div>
                </div>
            `
        } 
        else if (item.videoRecord) {
            elItem.innerHTML = `
                <video class="ml-auto rounded-[30px]" src="${item.videoRecord}" controls></video>
                <div class="text-end text-[12px] text-white">
                    ${item.createAt}
                </div>
            `
        } 
        else if (item.audio) {
            elItem.innerHTML = `
                <div class="bg-[#0088cc] p-2 rounded-[18px]">
                    <audio controls class="w-full">
                        <source src="${item.audio}" type="audio/webm">
                    </audio>
                    <div class="text-end text-[12px] text-white">
                        ${item.createAt}
                    </div>
                </div>
            `
        } 
        else {
            elItem.innerHTML = `
                <div class="bg-[#0088cc] p-2 rounded-[18px] text-white">
                    <p>${item.content}</p>
                    <div class="text-end text-[12px]">${item.createAt}</div>
                </div>
            `
        }

        list.appendChild(elItem)
    })
}

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
        videoRecord:videoUrl

    }

    messageList.push(data)
    set("message", messageList)
    renderMesseng(messageList, elList)

    imgUrl = null
    evt.target.reset()
    videoUrl = null
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



let mediaRecorder2
let videoChunks = []

elCamBtn.addEventListener("mousedown", async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
    })

    mediaRecorder2 = new MediaRecorder(stream)
    videoChunks = []

    mediaRecorder2.ondataavailable = e => {
        videoChunks.push(e.data)
    }

    mediaRecorder2.start()
})

elCamBtn.addEventListener("mouseup", () => {
    mediaRecorder2.onstop = () => {
        const videoBlob = new Blob(videoChunks, { type: "video/webm" })
        const videoUrl = URL.createObjectURL(videoBlob)

        const date = new Date()
        const time = `${date.getHours()}:${date.getMinutes()}`

        const data = {
            id: messageList.length ? messageList.at(-1).id + 1 : 1,
            videoRecord: videoUrl,
            createAt: time
        }

        messageList.push(data)
        renderMesseng(messageList, elList)
    }

    mediaRecorder2.stop()
})




