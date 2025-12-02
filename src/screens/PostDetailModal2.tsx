import React, { useRef, useState} from 'react';
import { View, Text, Dimensions, TouchableOpacity, ScrollView, StyleSheet, InteractionManager } from 'react-native';
import Video from 'react-native-video';
import { useNavigation } from '@react-navigation/native';
import Ionic from "react-native-vector-icons/Ionicons";
import AntDesign from "react-native-vector-icons/AntDesign";
import Feather from "react-native-vector-icons/Feather";

const SingleReel = ({item, index, currentIndex}) => {
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const videoRef = useRef(null);

    const onBuffer = buffer => {
        console.log('Buffering', buffer);
    };
    const onError = error => {
        console.error('error', error);
    };


    const [mute, setMute] = useState(false);

    const [like, setLike] = useState(item.isLike);

    return (
    <View
        style={{ width: windowWidth, height: windowHeight, position: 'relative' }}>
        <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => setMute(!mute)}
            style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
            }}>
            <Video
                videoref={videoRef}
                source={item.video}
                resizeMode="cover"
                repeat={true}
                onBuffer={onBuffer}
                onError={onError}
                paused={currentIndex === index ? false : true}
                style={{ 
                    width: '100%',
                    height: '100%',
                    position: 'absolute', 
                }}
                />
            </TouchableOpacity>
            <Ionic name="volume-mute"
            style={{
                fontsize: mute ? 20 : 0,
                color: 'white',
                position: 'absolute',
                top: windowHeight / 2.3,
                left: windowWidth / 2.3,
                backgroundColor:'rgba(52,52,52,0,6)',
                borderRadius: 100,
                padding: mute ? 20 : 0,
            }}
        />
        <View 
            style={{
                position: 'absolute',
                bottom: 80,
                zIndex: 1,
                width: windowWidth,
                padding: 10,
            }}>
            <View style={{}}>
                <TouchableOpacity style={{width: 125}}>
                    <View style={{
                       width: 32,
                       height: 32,
                       borderRadius: 100,
                       backgroundColor: 'white',
                       margin: 10,
                    }}>
                        <Image
                            source={item.video_url}
                            style={{
                                width: '100%',
                                height: '100%',
                                resizeMode: 'cover',
                                borderRadius: 100,
                            }}
                        />
                    </View>
                    <Text style={{color: 'white', fontSize: 16, fontWeight: 'bold'}}>{item.title}</Text> 
                </TouchableOpacity>
                <Text style={{color: 'white', fontSize: 14, marginHorizontal: 10}}>
                    {item.description}
                </Text>
                <View style={{flexDirection: 'row', padding: 10}}>
                    <Ionic
                        name="ios-musical-note"
                        style={{color: 'white', fontSize: 16}}
                    />
                    <Text style={{color: 'white'}}>Original Audio</Text>
                </View>
            </View>
        </View>
        <View style={{
            position: 'absolute', 
            bottom: 80, 
            right: 0,
          }}>
            <TouchableOpacity onePress={() => setLike(!like)} style={{padding: 10}}>
                <AntDesign 
                name={like ? "heart" : "hearto"} 
                style={{color: like ? 'red' : 'white', fontSize: 25}} 
                />
                <Text style={{color: 'white'}}>{item.likes}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{padding: 10}}>
                <Ionic 
                name="ios-chatbubble-outline" 
                style={{color: 'white', fontSize: 25, fonstSize: 25}} 
                />
            </TouchableOpacity>
            <TouchableOpacity style={{padding: 10}}>
                <Ionic 
                name="paper-plane-outline" 
                style={{color: 'white', fontSize: 25, fontSize: 25}} 
                />
            </TouchableOpacity>
            <TouchableOpacity style={{padding: 10}}>
                <Feather
                name="more-vertical" 
                style={{
                    color: 'white', 
                    fontSize: 25, 
                    fontSize: 25
                    }} 
                />
            </TouchableOpacity>
            <View style={{
                width: 30,
                height: 30,
                borderRadius: 10,
                borderWidth: 2,
                borderColor: 'white',
                margin: 10,
               }}>
                <Image 
                source={item.postProfile} 
                style={{
                    width: '100%', 
                    height: '100%', 
                    borderRadius: 10, 
                    resizeMode: 'cover',
                    }}
                />
            </View>
        </View>
    </View>
);
};

