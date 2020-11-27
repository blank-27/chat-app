// const messages = require("../../src/utils/messages");

const socket = io()

//elements
const $messageForm = document.querySelector('#message-form');
// const $messageFormInput = document.querySelector('#message-id');
const $messageFormInput = document.querySelector('input');
const $messageFormButton = document.querySelector('#send');
const $sendLocationButton = document.querySelector('#send-location');
const $messages = document.querySelector('#messages');
const $sidebar = document.querySelector('#sidebar')

const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationTemplate = document.querySelector('#location-template').innerHTML;
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;

const {username,room} = Qs.parse(location.search,{ignoreQueryPrefix:true})

const autoscroll = () => {
    const $newMessage = $messages.lastElementChild

    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    const visibleHeight = $messages.offsetHeight

    const containerHeight = $messages.scrollHeight

    const scrollOffset = $messages.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
}


socket.on('message',(message) => {
    console.log(message)

    const html = Mustache.render(messageTemplate,{
        username:message.username,
        message:message.text,
        createdAt:moment(message.createdAt).format('h:mm a')
    })

    $messages.insertAdjacentHTML('beforeend',html);
    autoscroll()

})

    socket.on('roomData',({room,users}) => {
        const rData = Mustache.render(sidebarTemplate,{
            room:room,
            users:users
        })

        console.log(room)
        console.log(users)
        $sidebar.innerHTML = rData;
    })


socket.on('locationMessage',(url) => {
    console.log(url)

    const htmlUrl = Mustache.render(locationTemplate,{
        username:url.username,
        pos:url.text,
        createdAt: moment(url.createdAt).format('h:mm a')
    })

    $messages.insertAdjacentHTML('beforeend',htmlUrl);
    autoscroll()

})



$messageForm.addEventListener('submit',(e) => {

    e.preventDefault()

    $messageFormButton.setAttribute('disabled','disabled') //msg button discabled
    const messageValue = $messageFormInput.value;
    console.log(e.target)
    // const messageValue = e.target.elements.message.value
    
    // if(messageValue===''){
    //     return 
    // }

    socket.emit('sendMessage',messageValue,(error) =>{
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value=''
        $messageFormInput.focus()

        if(error){
            return console.log(error)
        }
        console.log("Delivered!!")
    })
})



$sendLocationButton.addEventListener('click',() => {

    $sendLocationButton.setAttribute('disabled','disabled');

    if(!navigator.geolocation){
        return alert("bruh old browser")
    }

    navigator.geolocation.getCurrentPosition((position) => {
        // console.log(position.coords.latitude,position.coords.longitude)

        socket.emit('sendLocation',{
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
        },()=> {
            $sendLocationButton.removeAttribute('disabled');
            // console.log(msg)
        })
    })

})

socket.emit('join',{username,room},(error) => {
    if(error){
        alert (error)
        location.href='/'
    }
})