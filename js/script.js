// ELEMENTLAR
const elList = document.querySelector(".list")
const elMessageForm = document.querySelector(".message-form")
const elChooseImg = document.querySelector(".img-inp")
const elCamBtn = document.querySelector(".camera-btn")
const micBtn = document.querySelector("#micBtn")

// LOCAL STORAGE
function set(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
}

function get(key) {
    try {
        return JSON.parse(localStorage.getItem(key)) || []
    } catch {
        return []
    }
}

let messageList = get("message")

// PAGE LOADDA RENDER
renderMessage(messageList, elList)

// RENDER
function renderMessage(arr, list) {
    list.innerHTML = ""
    arr.forEach(item => {
        const li = document.createElement("li")
        li.className = "ml-auto w-[80%] mb-2"

        if (item.image) {
            li.innerHTML = `
                <div class="bg-[#0088cc] p-2 rounded text-white">
                    <img src="${item.image}" class="rounded mb-1"/>
                    <p>${item.content || ""}</p>
                    <div class="text-end text-xs">${item.time}</div>
                </div>`
        } 
        else if (item.video) {
            li.innerHTML = `
                <video src="${item.video}" controls class="w-full rounded"></video>
                <div class="text-end text-xs">${item.time}</div>`
        } 
        else if (item.audio) {
            li.innerHTML = `
                <audio controls class="w-full">
                    <source src="${item.audio}">
                </audio>
                <div class="text-end text-xs">${item.time}</div>`
        } 
        else {
            li.innerHTML = `
                <div class="bg-[#0088cc] p-2 rounded text-white">
                    <p>${item.content}</p>
                    <div class="text-end text-xs">${item.time}</div>
                </div>`
        }

        list.appendChild(li)
    })
}

// TIME
function getTime() {
    const d = new Date()
    return `${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`
}

// IMAGE
let imgUrl = null
elChooseImg.addEventListener("change", e => {
    imgUrl = URL.createObjectURL(e.target.files[0])
})

// TEXT / IMAGE SUBMIT
elMessageForm.addEventListener("submit", e => {
    e.preventDefault()

    const data = {
        id: Date.now(),
        content: e.target.message.value,
        image: imgUrl,
        time: getTime()
    }

    messageList.push(data)
    set("message", messageList)
    renderMessage(messageList, elList)

    imgUrl = null
    e.target.reset()
})

// AUDIO RECORD
let mediaRecorder
let audioChunks = []

micBtn.addEventListener("click", async () => {
    if (!mediaRecorder || mediaRecorder.state === "inactive") {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        mediaRecorder = new MediaRecorder(stream)
        audioChunks = []

        mediaRecorder.ondataavailable = e => audioChunks.push(e.data)

        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: "audio/webm" })
            const audioUrl = URL.createObjectURL(audioBlob)

            messageList.push({
                id: Date.now(),
                audio: audioUrl,
                time: getTime()
            })

            set("message", messageList)
            renderMessage(messageList, elList)
        }

        mediaRecorder.start()
        micBtn.classList.add("opacity-50")
    } else {
        mediaRecorder.stop()
        micBtn.classList.remove("opacity-50")
    }
})

// VIDEO RECORD
let mediaRecorder2
let videoChunks = []

elCamBtn.addEventListener("mousedown", async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    mediaRecorder2 = new MediaRecorder(stream)
    videoChunks = []

    mediaRecorder2.ondataavailable = e => videoChunks.push(e.data)
    mediaRecorder2.start()
})

elCamBtn.addEventListener("mouseup", () => {
    mediaRecorder2.onstop = () => {
        const blob = new Blob(videoChunks, { type: "video/webm" })
        const videoUrl = URL.createObjectURL(blob)

        messageList.push({
            id: Date.now(),
            video: videoUrl,
            time: getTime()
        })

        set("message", messageList)
        renderMessage(messageList, elList)
    }
    mediaRecorder2.stop()
})
