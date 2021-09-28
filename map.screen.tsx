import React, { useRef, useState } from 'react';
import { SafeAreaView, StyleSheet, Button } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import DrawCircleComponent from '../../components/draw-circle/draw-circle.component';


interface MapDrawScreenParams {
    navigation:any
}

const MapDrawScreen = (props: MapDrawScreenParams) => {
    
    const mapRef = useRef<MapView>(null)

    const [currentRegion, SetCurrentRegion] = useState({
        latitude: 0,
        longitude: 0,
        longitudeDelta: 0
    })
    const [openDrawCirle, setOpenDrawCirle] = useState(false)

    const mapCallback = (radius: any, center: any) => {
        //do something when completed draw
        //such as Circle radius, center {x, y} of Circle
    }

    return (
        <SafeAreaView style={{
            flex: 1,
          }}>
            <MapView
                style={StyleSheet.absoluteFillObject}
                ref={mapRef}
                initialRegion={{
                    latitude: 10.774258,
                    longitude: 106.6725779,
                    latitudeDelta: 0,
                    longitudeDelta: 0.0421,
                }}
                onRegionChangeComplete={(Region) => SetCurrentRegion({ latitude: Region.latitude, longitude: Region.longitude, longitudeDelta: Region.longitudeDelta })}
                >

            </MapView>
            {openDrawCirle && <DrawCircleComponent longitudeDelta={currentRegion.longitudeDelta} mapCallback={mapCallback} />}

            <Button onPress={()=>{setOpenDrawCirle(true)}}>Vẽ hình tròn</Button>
        </SafeAreaView>
    );
};

export default MapDrawScreen;