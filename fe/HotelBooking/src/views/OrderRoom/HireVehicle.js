import React,{useState,useEffect} from 'react';
import {View,TouchableOpacity,Text,Image,Dimensions, FlatList} from 'react-native';
import {Input} from 'react-native-elements';
import Icon from "react-native-vector-icons/FontAwesome"
import CustomHeader from '../../components/CustomHeader';
import Lottie from 'lottie-react-native';
import { useTheme } from 'react-native-paper';
import { AddNewVehicle, GetAllVehicle, GetVehicleById } from './apiVehicle';

import { useSelector } from 'react-redux';
import { motorcycleArray } from './datavehicle';

const width = Dimensions.get("window").width
const HireVehicle = ({navigation}) => {
  const {colors}=useTheme();
  const [searchKey, setSearchKey] = useState('');
  const [data, setData] = useState([]);
  const [dataFilter, setDataFilter] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const {idHotel}=useSelector(state=>state.VehicleReducer);
  const initFetch = async () => {
        setIsLoading(true);
        const res= await GetVehicleById(idHotel)
        setData(res.data);
        setDataFilter(res.data);
        setIsLoading(false);
  }
    const Format = number => {
    return number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
  };

  const onChangeSearchKey = text => {
      let dataFil= data.filter(item => {
                  return (item.name.toLowerCase().replace(/\s+/g, "")).includes(text.toLowerCase().replace(/\s+/g, ""));
        });
        setDataFilter(dataFil);
  }

  useEffect(() => {
        onChangeSearchKey(searchKey);
  }, [searchKey]);

  useEffect(() => {
        initFetch();
  }, []);

  const renderVehicle = (item,index) => {
        return (
                <View style={{
                        marginTop:10,
                      }}> 
                       <TouchableOpacity style={{
                        marginHorizontal:20,
                        borderColor: 'rgba(208, 208, 208, 0.5)',        
                        borderWidth: 1,
                        borderRadius: 15,
                       }}
                       onPress={()=>{
                           navigation.navigate("DetailVehicle",{
                                   item:item
                           })
                       }}
                       >
                        <View style={{
                               alignItems:"center",
                               marginTop:15
                        }}>
                                <Image
                                source={{
                                      uri:item.image[0]
                                }}
                                style={{
                                        width: 200,
                                        height: 150,
                                }}
                                />
                        </View>
                        <Text style={{
                                fontSize:14,
                                color:"#16161A",
                                fontWeight:'500',
                                marginHorizontal:10
                        }}>
                                {item.name}
                        </Text>
                        <View style={{
                                backgroundColor:"#E2E2E2",
                                justifyContent:"space-between",
                                borderBottomLeftRadius:15,
                                borderBottomRightRadius:15,
                                marginTop:10,
                                flexDirection:"row",
                                alignItems:"center",
                        }}>
                                <View style={{
                                        paddingVertical:15,
                                        marginHorizontal:10,
                                }}>
                                        <View style={{flexDirection:"row"}}>
                                                <Icon
                                                name='check'
                                                color={colors.primary}
                                                size={17}
                                                />
                                                <Text style={{
                                                        fontSize:14,
                                                        left:8,
                                                        color:"#16161A",
                                                        fontWeight:'500',
                                                        bottom:2,
                                                }}>
                                                      Instant confirmation  
                                                </Text>
                                        </View>
                                        <View style={{flexDirection:"row",marginTop:10}}>
                                                <Icon
                                                name='check'
                                                color={colors.primary}
                                                size={17}
                                                />
                                                <Text style={{
                                                        fontSize:14,
                                                        left:8,
                                                        color:"#16161A",
                                                        fontWeight:'500',
                                                        bottom:2,
                                                }}>
                                                      Free cancellation
                                                </Text>
                                        </View>
                                </View>
                                <View style={{
                                        marginHorizontal:10,
                                }}>
                                        <Text style={{
                                                fontSize:14,
                                                color:"#16161A",
                                                fontWeight:"500"
                                        }}>
                                                Day/<Text style={{
                                                        fontSize:14,
                                                        color:colors.primary,
                                                        fontWeight:"700"
                                                }}>
                                                        {Format(item.price)} VNĐ
                                                </Text>
                                        </Text>
                                </View>
                        </View>
                       </TouchableOpacity>
                      </View>
        )
  }
  return (
    <View style={{
        flex:1,
        backgroundColor:"white",
    }}>
        <CustomHeader
        title={"Hire Vehicle"}
        />
        {isLoading ? (
        <>
          <Lottie
            style={{}}
            source={require('../../assets/animations/140846-vertical-animation.json')}
            autoPlay
            loop
          />
        </>):(
      <View style={{
        marginTop:20,
        marginHorizontal:5
      }}>
        <Input
          value={searchKey}
          onChangeText={text => setSearchKey(text)}
          placeholder="Search"
          inputContainerStyle={{
            borderColor: 'rgba(208, 208, 208, 0.5)',
            backgroundColor: "#EAECF0",
            borderWidth: 1,
            borderRadius: 15,
            paddingHorizontal: 8,
            paddingVertical: 2,
            shadowColor: 'rgba(0, 0, 0, 0.1)',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 1,
            shadowRadius: 4,
            elevation: 5,
          }}
        //   onSubmitEditing={onChangeName}
          rightIcon={
                searchKey=== ""?
                <Icon
                name='search'
                color={"black"}
                size={20}
                />:
                <Icon
                onPress={() => setSearchKey("")}
                name='close'
                color={"black"}
                size={25}/>
          }
        />
        <FlatList
        style={{
                marginBottom:200
        }}
        data={searchKey===""?data:dataFilter}
        renderItem={
                ({item,index})=>renderVehicle(item,index)
        }
        keyExtractor={(item) => item._id}
        />
      </View>
        )}
    </View>
  );
};

export default HireVehicle;
