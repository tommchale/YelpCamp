mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'show-map',
    style: 'mapbox://styles/mapbox/light-v10', // stylesheet location
    center: campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 6 // starting zoom
});

const nav = new mapboxgl.NavigationControl({visualizePitch: true});
map.addControl(nav, 'top-right');

new mapboxgl.Marker({ color: '#ff3399' })
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h3>${campground.title}</h3><p>${campground.location}</p>`
            )
    )
    .addTo(map)