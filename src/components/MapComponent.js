import React, { useRef, useState } from 'react';
import { Map, Placemark, Polyline } from 'react-yandex-maps';

export function MapComponent() {
    const map = useRef(null);

    //Хранилище для состояния координат центра карты
    const [centerCoord, setcenterCoord] = useState([55.76, 37.64]);

    //Хранилище для состояния значений всех меток
    const [placemarks, setplacemarks] = useState([{ coord: [55.76, 37.64], id: 0, name: "Start" }]);

    //Хранилище для имени метки из input
    const inputEl = useRef(null);

    const mapState = { center: [55.76, 37.64], zoom: 10 };

    //Смена координат центра карты при прокрутке карты
    let onBoundsChange = e => {
        setcenterCoord(e.get('target').getCenter())
    }

    //Смена координат метки при перемещении метки
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

    //Добавление метки
    let addPlacemark = () => {
        setplacemarks([...placemarks, { coord: centerCoord, id: placemarks[placemarks.length - 1].id + 1, name: inputEl.current.value }])
    }

    //Удаление метки
    let deletePlacemark = (element) => {
        let array = placemarks.filter(e => e.id != element.id)
        setplacemarks(array)
    }

    let geocode = (ymaps) => {
        ymaps.geocode('Мытищи')
            .then(result => console.log(result))
    }

    return (
        <div className="page">
            <div className="pageOptions">
                <button onClick={() => addPlacemark()}>Добавить метку</button>
                <form onSubmit={(e) => { e.preventDefault(); addPlacemark() }}>
                    <input ref={inputEl} defaultValue="Новая метка" />
                </form>

                {
                    //создание описания меток меток
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
                onLoad={ymaps => geocode(ymaps)}
                modules={['geocode']}
                instanceRef={map}
                defaultState={mapState}
                onBoundsChange={onBoundsChange}
                width='500px'
                height='500px'
            >
                {
                    //создание меток
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
                    //создание маршрута между метками 
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
