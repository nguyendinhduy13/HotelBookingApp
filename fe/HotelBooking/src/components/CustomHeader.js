import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
const windowWidth = Dimensions.get('window').width;
const CustomHeader = ({ title, socket, id }) => {
    const navigation = useNavigation();
    const { t } = useTranslation();
    const { colors } = useTheme();
    return (
        <View style={[styles.header, { backgroundColor: colors.box }]}>
            <Icon
                name="arrow-back-ios"
                size={25}
                color={colors.text}
                onPress={() => {
                    navigation.goBack();
                    socket?.emit('leave-room', id);
                }}
            />
            <Text style={[styles.headerText, { color: colors.text }]}>
                {t(title)}
            </Text>
            <View />
        </View>
    );
};
export default CustomHeader;

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        elevation: 5,
    },
    headerText: {
        fontSize: 18,
        fontWeight: '700',
        lineHeight: 26,
        textAlign: 'center',
    },
});
