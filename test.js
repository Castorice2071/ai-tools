function initMap() {
    let addressLatLng = {
            lat: Number(window.$nuxt?.$store.state.country?.latitude || 0),
            lng: Number(window.$nuxt?.$store.state.country?.longitude || 0),
        },
        map = new google.maps.Map(document.getElementById("map"), {
            center: addressLatLng,
            zoom: 8,
        }),
        marker = new google.maps.Marker({
            position: addressLatLng,
            map: map,
            title: window.$nuxt?.$store.state.proName,
        });
}
