/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the UI Kitten template
 * https://github.com/akveo/react-native-ui-kitten
 *
 * Documentation: https://akveo.github.io/react-native-ui-kitten/docs
 *
 * @format
 */

import React from 'react';
import {StyleSheet} from 'react-native';
import {Router, Scene} from 'react-native-router-flux';
import {ApplicationProvider} from '@ui-kitten/components';
import * as eva from '@eva-design/eva';

import OpenStreetMap from './components/OpenStreetMap';
import Search from './components/Search';

/**
 * Use any valid `name` property from eva icons (e.g `github`, or `heart-outline`)
 * https://akveo.github.io/eva-icons
 */

export default () => (
    <>
        <ApplicationProvider {...eva} theme={eva.light}>
            <Router>
                <Scene
                    key={'root'}
                >
                    <Scene
                        key={'map'}
                        component={OpenStreetMap}
                        hideNavBar={true}
                    />
                    <Scene
                        key={'search'}
                        component={Search}
                        hideNavBar={true}
                    />
                </Scene>
            </Router>
        </ApplicationProvider>
    </>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        textAlign: 'center',
    },
    likeButton: {
        marginVertical: 16,
    },
});
