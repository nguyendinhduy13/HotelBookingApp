import {StyleSheet, Text, View} from 'react-native';
import React, {useRef} from 'react';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import CustomHeader from '../../components/CustomHeader';
import {useSelector} from 'react-redux';
const Map = ({route}) => {
  const mapRef = useRef(null);
  const hotel = route.params;
  const {user_position} = useSelector(state => state.global);
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <CustomHeader title="Map" />
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={{flex: 1}}
        initialRegion={{
          latitude: Number(hotel.position[0]),
          longitude: Number(hotel.position[1]),
          latitudeDelta: 0.0115,
          longitudeDelta: 0.0121,
        }}>
        <Marker
          coordinate={{
            latitude: Number(hotel.position[0]),
            longitude: Number(hotel.position[1]),
          }}
        />
      </MapView>
    </View>
  );
};

export default Map;

const styles = StyleSheet.create({});
