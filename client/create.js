const createLocation = document.getElementById('location')
const createItem = document.getElementById('item')
const locationInput = document.getElementById('location-input')
const containerInput = document.getElementById('container-input')
const subcontainerInput = document.getElementById('subcontainer-input')
const itemInput = document.getElementById('item-input')
const descriptionInput = document.getElementById('description-input')
const existingLocation = document.getElementById('existing-location')
const existingContainer = document.getElementById('existing-container')
const existingSubcontainer = document.getElementById('existing-subcontainer')
const locationText = document.getElementById('location-text')
const containerText = document.getElementById('container-text')
const subconText = document.getElementById('subcon-text')
const itemText= document.getElementById('item-text')
const locationBlank = document.getElementById('location-blank')
const containerBlank = document.getElementById('container-blank')
const locationSuccess = document.getElementById('location-success')
const containerSuccess = document.getElementById('container-success')
const subconSuccess = document.getElementById('subcon-success')
const blankItem = document.getElementById('blank-item')
const locationText2 = document.getElementById('location-text2')
const blankLocation = document.getElementById('blank-location')
const badLocation = document.getElementById('bad-location')
const containerText2 = document.getElementById('container-text2')
const blankContainer = document.getElementById('blank-container')
const badContainer = document.getElementById('bad-container')
const subconText2 = document.getElementById('subcon-text2')
const badSubcon = document.getElementById('bad-subcon')
const badPlace = document.getElementById('bad-place')

const host = 'http://localhost:5050'

function newLocation (e) {
    e.preventDefault()

    locationText.classList.remove('hide')
    locationBlank.classList.add('hide')
    locationSuccess.classList.add('hide')
    containerText.classList.remove('hide')
    containerBlank.classList.add('hide')
    containerSuccess.classList.add('hide')
    subconSuccess.classList.add('hide')

    const body = {
        location: locationInput.value,
        container: containerInput.value,
        subcontainer: subcontainerInput.value
    }

    if (body.location === ''){
        locationText.classList.add ('hide')
        locationBlank.classList.remove('hide')
        return
    }
    
    if (body.container === ''){
        containerText.classList.add ('hide')
        containerBlank.classList.remove('hide')
        return
    }

    axios.post(`${host}/create_location/`, body)
        .then(res => {
            if (res.status === 201) {
                locationSuccess.classList.remove('hide')
                locationSuccess.innerHTML = `New location, ${body.location}, was successfully created.`
            } else if (res.data.errors[0].message === 'name must be unique'){
                locationSuccess.classList.remove('hide')
                locationSuccess.innerHTML = `${body.location} is a previously created valid location.`
                console.log(`${body.location} is a previously created valid location.`)
            } else {
                console.log(res)
            }
        })

    axios.post(`${host}/create_container/`, body)
        .then(res => {
            if (res.status === 201) {
                containerSuccess.classList.remove('hide')
                containerSuccess.innerHTML = `New container, ${body.container}, was successfully created.`
            } else if (res.data.errors[0].message === 'name must be unique'){
                containerSuccess.classList.remove('hide')
                containerSuccess.innerHTML = `${body.container} is a previously created valid container.`
            } else {
                console.log(res)
            }
})

    axios.post(`${host}/create_subcontainer/`, body)
        .then(res => {
            if (res.status === 201) {
                subconSuccess.classList.remove('hide')
                subconSuccess.innerHTML = `New subcontainer, ${body.subcontainer}, was successfully created.`
            } else if (res.data.errors[0].message === 'name must be unique'){
                subconSuccess.classList.remove('hide')
                subconSuccess.innerHTML = `${body.subcontainer} is a previously created valid subcontainer.`
            } else {
                console.log(res)
            }
    })

    axios.post(`${host}/create_join_table/`, body)
        .then(res => {
            console.log('This is the create_join_table response', res)
    })    
}

function newItem (e) {
    e.preventDefault()

    itemText.classList.remove('hide')
    blankItem.classList.add('hide')
    locationText2.classList.remove('hide')
    blankLocation.classList.add('hide')
    badLocation.classList.add('hide')
    containerText2.classList.remove('hide')
    blankContainer.classList.add('hide')
    badContainer.classList.add('hide')
    subconText2.classList.remove('hide')
    badSubcon.classList.add('hide')
    badPlace.classList.add('hide')

    const body = {
        item: itemInput.value,
        description: descriptionInput.value,
        location: existingLocation.value,
        container: existingContainer.value,
        subcontainer: existingSubcontainer.value,
        joinTableID: 0
    }

    let locations = []
    let containers = []
    let subcontainers = []
    let goodPlace = false
    let placeExists = true
    

    if (body.item === ''){
        itemText.classList.add('hide')
        blankItem.classList.remove('hide')
        return
    }

    if (body.location === ''){
        locationText2.classList.add('hide')
        blankLocation.classList.remove('hide')
        return
    }
    
    if (body.container === ''){
        containerText2.classList.add('hide')
        blankContainer.classList.remove('hide')
        return
    }

    axios.get(`${host}/get_locations/`)
        .then(res => {
            for (let i = 0; i < res.data.length; i++){
                locations.push(res.data[i].name)
            }

            if (!locations.includes(body.location)){
                locationText2.classList.add('hide')
                badLocation.classList.remove('hide')
                placeExists = false
            }
        })

    axios.get(`${host}/get_containers/`)
        .then(res => {
            for (let i = 0; i < res.data.length; i++){
                containers.push(res.data[i].name)
            }

            if (!containers.includes(body.container)){
                containerText2.classList.add('hide')
                badContainer.classList.remove('hide')
                placeExists = false
            }
        })

    axios.get(`${host}/get_subcontainers/`)
        .then(res => {
            for (let i = 0; i < res.data.length; i++){
            subcontainers.push(res.data[i].name)
            }

            if (!subcontainers.includes(body.subcontainer)){
                subconText2.classList.add('hide')
                badSubcon.classList.remove('hide')
                placeExists = false
            }
        })

    axios.get(`${host}/get_join_table`)
        .then(res => {
            console.log(res.data)
            for (let i = 0; i < res.data.length; i++){
                if (body.location === res.data[i].locname && body.container === res.data[i].conname && body.subcontainer === res.data[i].subname){
                    goodPlace = true
                    body.joinTableID = res.data[i].jtid
                } 
            }
            console.log(goodPlace, 'inside')
        })
    
    setTimeout((e) => {
        console.log(placeExists, goodPlace)
        if (placeExists && goodPlace){
            axios.post(`${host}/create_item`, body)
        } else {
            badPlace.classList.remove('hide')
        }
    }, 3000);
    console.log(goodPlace, 'outside')
    // if (goodPlace){
    //     storeItem(body, joinTableID)
    // } else {
    //     badPlace.classList.remove('hide')
    // }
}





createLocation.addEventListener('submit', newLocation)
createItem.addEventListener('submit', newItem)