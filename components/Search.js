import React, {Component} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Input, Divider, List, ListItem} from '@ui-kitten/components';
import {Actions} from 'react-native-router-flux';

import data from '../resources/data.json';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchInput: '',
            locations: [],
            destId: null,
            searchType: 0,
            clipboard: '',
            currentCoords: props.currentCoords ? props.currentCoords : null,
            dest_building: null,
        };
    }

    removeAccents(string) {
        return string.normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/Đ/g, 'D')
            .trim()
            .toLowerCase();
    }

    isIncludes(string, keyword) {
        return this.removeAccents(string).includes(this.removeAccents(keyword));
    }

    render() {
        return (
            <View>
                <Input
                    accessoryLeft={() => {
                        return <Icon
                            name={'arrow-back'}
                            size={24}
                            color={'black'}
                            onPress={() => {
                                this.state.searchType === 0 ? Actions.map() : this.setState({
                                    searchType: 0,
                                    searchInput: this.state.clipboard,
                                    locations: [this.state.clipboardItem],
                                });
                            }}
                        />;
                    }}
                    size={'medium'}
                    placeholder={this.state.searchType === 0 ? 'Bạn muốn đi đâu?' : 'Chọn điểm xuất phát'}
                    style={styles.searchInput}
                    value={this.state.searchInput}
                    onChangeText={(text) => {
                        this.setState({searchInput: text}, () => {
                            if (text !== '') {
                                let filteredLocations = data.filter((item) => {
                                    let searchInput = this.state.searchInput;
                                    return this.isIncludes(item.name, searchInput) || this.isIncludes(item.room, searchInput);
                                });
                                if (this.state.searchType === 1) {
                                    filteredLocations = filteredLocations.filter((item) => {
                                        return item.room.split('-')[0] !== this.state.dest_building;
                                    });
                                    if (this.state.currentCoords) {
                                        filteredLocations.unshift({
                                            id: 0,
                                            name: 'Vị trí hiện tại',
                                            room: '',
                                        });
                                    }
                                }
                                this.setState({
                                    locations: filteredLocations,
                                });
                            }
                        });
                    }}
                />
                <List
                    data={this.state.locations}
                    ItemSeparatorComponent={Divider}
                    renderItem={({item, index}) => (
                        <ListItem
                            title={item.name}
                            description={item.room}
                            onPress={() => {
                                if (this.state.searchType === 0) {
                                    this.setState({
                                        destId: item.id,
                                        locations: [],
                                        searchInput: '',
                                        searchType: 1,
                                        clipboardItem: item,
                                        clipboard: item.name,
                                        dest_building: item.room.split('-')[0],
                                    });
                                } else {
                                    if (item.id === 0) {
                                        fetch('http://localhost:5000/path_from_location',
                                            {
                                                method: 'POST',
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                },
                                                body: JSON.stringify({
                                                    longitude: this.state.currentCoords[0],
                                                    latitude: this.state.currentCoords[1],
                                                    dest_id: this.state.destId,
                                                }),
                                            })
                                            .then((response) => response.json())
                                            .then((json) => {
                                                Actions.map({
                                                    pathData: json,
                                                });
                                            });
                                    } else {
                                        fetch('http://localhost:5000/path',
                                            {
                                                method: 'POST',
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                },
                                                body: JSON.stringify({
                                                    source_id: item.id,
                                                    dest_id: this.state.destId,
                                                }),
                                            })
                                            .then((response) => response.json())
                                            .then((json) => {
                                                Actions.map({
                                                    pathData: json,
                                                });
                                            });
                                    }
                                }
                            }}
                        />
                    )}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    searchInput: {
        marginTop: 0.025 * screenWidth,
        marginLeft: 0.0125 * screenHeight,
        marginRight: 0.0125 * screenHeight,
        borderRadius: 10,
    },
});
