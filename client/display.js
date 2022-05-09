const lookLocation = document.getElementById('look-location')
const lookContainer = document.getElementById('look-container')
const lookSubcon = document.getElementById('look-subcon')
const lookLocations = document.getElementById('look-locations')
const lookItems = document.getElementById('look-items')
const lookItem = document.getElementById('look-item')
const seeItems = document.getElementById('see-items')
const seeLocation = document.getElementById('see-location')

const host = 'http://localhost:5050'

function getItems (e) {
    e.preventDefault()

    axios.get(`${host}/see_items?location=${lookLocation.value}&container=${lookContainer.value}&subcon=${lookSubcon.value}`)
        .then (res => {
            res.data.forEach(item => {
                const p = document.createElement('p')
                p.textContent = item.name
                seeItems.appendChild(p)
            })
        })
}

function getLocation (e) {
    e.preventDefault()

    axios.get(`${host}/item_table/?item=${lookItem.value}`)
        .then (res => {
            const {location_id, container_id, sub_id} = res.data[0]

            axios.get(`${host}/get_location?location=${location_id}`)
                .then(res => {
                    const p = document.createElement('p')
                    p.textContent = res.data[0].name
                    seeLocation.appendChild(p)
                })
                .catch(err => console.log(err))

            axios.get(`${host}/get_container?container=${container_id}`)
                .then(res => {
                    const p = document.createElement('p')
                    p.textContent = res.data[0].name
                    seeLocation.appendChild(p)
                })
                .catch(err => console.log(err))

            axios.get(`${host}/get_sub?subcon=${sub_id}`)
                .then(res => {
                    const p = document.createElement('p')
                    p.textContent = res.data[0].name
                    seeLocation.appendChild(p)
                }) 
                .catch(err => console.log(err))           
        })
        .catch(err => console.log(err))
}

lookLocations.addEventListener('submit', getItems)
lookItems.addEventListener('submit', getLocation)
