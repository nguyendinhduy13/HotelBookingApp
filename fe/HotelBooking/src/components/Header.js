import React from 'react';
import { Image, Text, View } from 'react-native';
import { useTheme } from 'react-native-paper';
export default function Header({ name }) {
    const { colors } = useTheme();
    return (
        <View
            style={{
                flexDirection: 'row',
                alignItems: 'center',
            }}>
            <Image
                source={require('../assets/logo.png')}
                style={{
                    width: 60,
                    height: 60,
                    resizeMode: 'cover',
                }}
            />
            <Text
                style={{
                    fontSize: 20,
                    fontWeight: '700',
                    color: colors.text,
                }}>
                {name}
            </Text>
        </View>
    );
}
