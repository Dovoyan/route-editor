import React, { useRef, useState } from 'react';
import { Map, Placemark, Polyline } from 'react-yandex-maps';

export function MapComponent() {
    const map = useRef(null);

    const [centerCoord, setcenterCoord] = useState([55.76, 37.64]);

    const [placemarks, setplacemarks] = useState([{ coord: [55.76, 37.64], id: 0, name: "Start" }]);

    const inputEl = useRef(null);

    const mapState = { center: [55.76, 37.64], zoom: 10 };


    let onBoundsChange = e => {
        setcenterCoord(e.get('target').getCenter())
    }

    //Changing the coordinates of the placemark when moving the placemark
    let onBoundsPlacemarkChange = (e, id) => {
        let array = [];
        placemarks.map((element) => {
            if (element.id === id) {
                element.coord = e
            }
            array.push(element);
        })
        setplacemarks(array)
    }


    let addPlacemark = () => {
        setplacemarks([...placemarks, { coord: centerCoord, id: placemarks[placemarks.length - 1].id + 1, name: inputEl.current.value }])
    }


    let deletePlacemark = (element) => {
        let array = placemarks.filter(e => e.id != element.id)
        setplacemarks(array)
    }


    return (
        <div className="page">
            <div className="pageOptions">
                <button onClick={() => addPlacemark()}>Добавить метку</button>
                <form onSubmit={(e) => { e.preventDefault(); addPlacemark() }}>
                    <input ref={inputEl} defaultValue="Новая метка" />
                </form>

                {

                    placemarks.map((e) => {
                        return (
                            <div className="placemark">

                                <div className="placemarkEl">{e.name}</div>
                                <button onClick={() => deletePlacemark(e)}>delete</button>
                            </div>
                        )
                    })}
            </div>
            <Map
                instanceRef={map}
                defaultState={mapState}
                onBoundsChange={onBoundsChange}
                width='500px'
                height='500px'
            >
                {
                    //create label
                    placemarks.map((element) => {
                        return (
                            <Placemark
                                onDragEnd={e => onBoundsPlacemarkChange(e.get('target').geometry.getCoordinates(), element.id)}
                                options={{
                                    draggable: true,
                                    hideIconOnBalloonOpen: false,
                                    hasBalloon: true

                                }}
                                geometry={element.coord}
                                modules={['geoObject.addon.balloon', 'geoObject.addon.hint']}
                                properties={{
                                    balloonContentHeader: element.name,
                                }}
                            />
                        )
                    })}
                {
                    //creating a route between labels
                    placemarks.map((e, index) => {
                        let polyGeo = [];
                        if (placemarks[index + 1]) {
                            polyGeo.push(placemarks[index].coord)
                            polyGeo.push(placemarks[index + 1].coord)
                            return (
                                <Polyline

                                    geometry={
                                        polyGeo
                                    }
                                    options={{
                                        balloonCloseButton: false,
                                        strokeColor: '#000',
                                        strokeWidth: 4,
                                        strokeOpacity: 0.5,
                                    }}
                                />
                            )
                        }
                    })
                }
            </Map>
        </div>
    )
}
