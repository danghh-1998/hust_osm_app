import React, {Component} from 'react';
import {View, StyleSheet, Image} from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import {Button} from '@ui-kitten/components';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Actions} from 'react-native-router-flux';
import pin from '../resources/marker.png';


MapboxGL.setAccessToken('pk.eyJ1IjoicmVndWx1c2xlbyIsImEiOiJja2JvenFyNnYyN2xmMnlsOXhicHp1Ymt1In0.aUJ9m-kuZkvlYGWOzFaldA');
MapboxGL.setConnected(true);

const TargetIcon = () => (
    <Icon
        name={'target'}
        size={20}
        color={'blue'}
    />
);

const DirectionIcon = () => (
    <Icon
        name={'directions'}
        size={20}
        color={'white'}
    />
);

export default class OpenStreetMap extends Component {

    async requesrLocationPermission() {
        await MapboxGL.requestAndroidLocationPermissions();
    }

    componentDidMount() {
        MapboxGL.setTelemetryEnabled(false);
        this.requesrLocationPermission().then(() => {
        });
    }

    constructor(props) {
        super(props);
        let pathArray = props.pathData ? JSON.parse(props.pathData).path : [];
        this.state = {
            initialCoords: [105.8430386, 21.0037292],
            currentCoords: [105.8430386, 21.0037292],
            _map: null,
            camera: null,
            path: !props.pathData ? null : {
                'type': 'FeatureCollection',
                'features': [
                    {
                        'type': 'Feature',
                        'properties': {},
                        'geometry': {
                            'type': 'LineString',
                            'coordinates': pathArray,
                        },
                    },
                ],
            },
            startPoint: !props.pathData ? null : {
                'type': 'FeatureCollection',
                'features': [
                    {
                        'type': 'Feature',
                        'properties': {
                            'icon': 'pin',
                        },
                        'geometry': {
                            'type': 'Point',
                            'coordinates': pathArray[0],
                        },
                    },
                    {
                        'type': 'Feature',
                        'properties': {
                            'icon': 'pin',
                        },
                        'geometry': {
                            'type': 'Point',
                            'coordinates': pathArray[pathArray.length - 1],
                        },
                    },
                ],
            },
        };
    }


    render() {
        return (
            <View style={styles.page}>
                <View style={styles.container}>
                    <MapboxGL.MapView
                        ref={map => this.state._map = map}
                        style={styles.map}
                        logoEnabled={false}
                    >
                        <MapboxGL.Camera
                            ref={(c) => (this.camera = c)}
                            zoomLevel={16}
                            animationMode={'flyTo'}
                            animationDuration={0}
                            centerCoordinate={this.state.currentCoords}
                        >
                        </MapboxGL.Camera>
                        <MapboxGL.UserLocation
                            onUpdate={location => {
                                this.setState({
                                    currentCoords: [location.coords.longitude, location.coords.latitude]
                                })
                            }}
                        />
                        {
                            this.state.path && (
                                <View>
                                    <MapboxGL.ShapeSource id={'path'}
                                                          shape={this.state.path}
                                    >
                                        <MapboxGL.LineLayer id='linelayer'
                                                            style={{
                                                                lineColor: '#669DF6',
                                                                lineCap: 'round',
                                                                lineJoin: 'round',
                                                                lineWidth: 5,
                                                            }}
                                        />
                                    </MapboxGL.ShapeSource>
                                    <MapboxGL.Images
                                        images={{
                                            pin: pin,
                                        }}
                                    />
                                    <MapboxGL.ShapeSource id={'examplepoint'}
                                                          shape={this.state.startPoint}
                                    >
                                        <MapboxGL.SymbolLayer
                                            id={'example'}
                                            style={{
                                                iconImage: ['get', 'icon'],
                                                iconAllowOverlap: false,
                                                iconSize: 0.4,
                                                iconOffset: [0, -20],
                                            }}
                                        />
                                    </MapboxGL.ShapeSource>
                                </View>
                            )
                        }
                    </MapboxGL.MapView>
                </View>
                <Button style={styles.currentLocationButton}
                        onPress={() => {
                            this.camera.flyTo(this.state.currentCoords);
                        }}
                        size={'giant'}
                        accessoryLeft={TargetIcon}
                />
                <Button style={styles.directionButton}
                        onPress={() => {
                            Actions.search({
                                currentCoords: this.state.currentCoords,
                            });
                        }}
                        size={'giant'}
                        accessoryLeft={DirectionIcon}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    container: {
        height: '100%',
        width: '100%',
        backgroundColor: 'white',
    },
    map: {
        flex: 1,
    },
    currentLocationButton: {
        position: 'absolute',
        right: 20,
        bottom: 50,
        borderRadius: 50,
        backgroundColor: 'white',
        borderColor: 'white',
    },
    directionButton: {
        position: 'absolute',
        right: 20,
        bottom: 120,
        borderRadius: 50,
    },
});
