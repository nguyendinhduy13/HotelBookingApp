import React, { useState } from 'react';
import { Image, Modal, ScrollView, TouchableOpacity, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import CustomHeader from '../../components/CustomHeader';

const ImageRoom = ({ route, navigation }) => {
    const [item, setItem] = useState(route.params);
    const [index, setIndex] = useState(0);
    const [itemzoom, setitemzoom] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const { colors } = useTheme();
    return (
        <ScrollView
            contentContainerStyle={
                !modalVisible
                    ? {
                          backgroundColor: colors.bg,
                          flex: 1,
                          paddingBottom: 20,
                      }
                    : {
                          backgroundColor: colors.box,
                          flex: 1,
                          paddingBottom: 20,
                      }
            }>
            <CustomHeader title={'gallery-photos'} />

            <ScrollView>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                    {item.image.map((image, index) => (
                        <TouchableOpacity
                            onPress={() => {
                                setModalVisible(!modalVisible),
                                    setitemzoom(item),
                                    setIndex(index);
                            }}>
                            <Image
                                source={{ uri: image }}
                                style={{
                                    width: 160,
                                    height: 150,
                                    marginTop: 20,
                                    marginHorizontal: 15,
                                    borderRadius: 10,
                                }}
                            />
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
            <Modal
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <TouchableOpacity
                    style={{ width: '100%', height: '100%' }}
                    onPress={() => {
                        setModalVisible(!modalVisible);
                    }}>
                    <View
                        style={{
                            width: '100%',
                            height: '100%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: 'rgba(0,0,0,0.5)',
                        }}>
                        <Image
                            source={{
                                uri: modalVisible
                                    ? itemzoom.image[index]
                                    : item.image[0],
                            }}
                            style={{
                                width: '90%',
                                height: '50%',
                                borderRadius: 10,
                                resizeMode: 'cover',
                            }}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        </ScrollView>
    );
};

export default ImageRoom;
