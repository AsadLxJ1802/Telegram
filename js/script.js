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
