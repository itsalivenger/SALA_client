import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    FlatList,
    TextInput,
    SafeAreaView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../theme';
import { MOROCCAN_CITIES } from '../constants/cities';

interface CityPickerProps {
    value: string;
    onSelect: (city: string) => void;
    placeholder?: string;
}

export const CityPicker = ({ value, onSelect, placeholder = 'Choisir une ville' }: CityPickerProps) => {
    const { colors, spacing } = useTheme();
    const [modalVisible, setModalVisible] = useState(false);
    const [search, setSearch] = useState('');

    const filteredCities = MOROCCAN_CITIES.filter(city =>
        city.toLowerCase().includes(search.toLowerCase())
    );

    const handleSelect = (city: string) => {
        onSelect(city);
        setModalVisible(false);
        setSearch('');
    };

    return (
        <>
            <TouchableOpacity
                style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}
                onPress={() => setModalVisible(true)}
                activeOpacity={0.7}
            >
                <Text style={[styles.valueText, { color: value ? colors.textPrimary : colors.disabled }]}>
                    {value || placeholder}
                </Text>
                <MaterialCommunityIcons name="chevron-down" size={24} color={colors.textSecondary} />
            </TouchableOpacity>

            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={false}
                onRequestClose={() => setModalVisible(false)}
            >
                <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.background }]}>
                    <View style={styles.modalHeader}>
                        <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                            <MaterialCommunityIcons name="close" size={28} color={colors.textPrimary} />
                        </TouchableOpacity>
                        <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Sélectionner une ville</Text>
                        <View style={{ width: 28 }} />
                    </View>

                    <View style={[styles.searchWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <MaterialCommunityIcons name="magnify" size={20} color={colors.textSecondary} />
                        <TextInput
                            style={[styles.searchInput, { color: colors.textPrimary }]}
                            placeholder="Rechercher une ville..."
                            placeholderTextColor={colors.disabled}
                            value={search}
                            onChangeText={setSearch}
                        />
                        {search.length > 0 && (
                            <TouchableOpacity onPress={() => setSearch('')}>
                                <MaterialCommunityIcons name="close-circle" size={20} color={colors.disabled} />
                            </TouchableOpacity>
                        )}
                    </View>

                    <FlatList
                        data={filteredCities}
                        keyExtractor={(item) => item}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[styles.cityItem, { borderBottomColor: colors.border }]}
                                onPress={() => handleSelect(item)}
                            >
                                <Text style={[
                                    styles.cityText,
                                    { color: colors.textPrimary },
                                    value === item && { color: colors.brand, fontWeight: 'bold' }
                                ]}>
                                    {item}
                                </Text>
                                {value === item && (
                                    <MaterialCommunityIcons name="check" size={20} color={colors.brand} />
                                )}
                            </TouchableOpacity>
                        )}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                                    Aucune ville trouvée
                                </Text>
                            </View>
                        }
                    />
                </SafeAreaView>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 56,
        borderRadius: 12,
        borderWidth: 1,
        paddingHorizontal: 16,
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    valueText: {
        fontSize: 16,
    },
    modalContainer: {
        flex: 1,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    closeButton: {
        padding: 4,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    searchWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        paddingHorizontal: 12,
        height: 48,
        borderRadius: 10,
        borderWidth: 1,
        marginBottom: 16,
    },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 16,
    },
    cityItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        marginHorizontal: 16,
        borderBottomWidth: 1,
    },
    cityText: {
        fontSize: 16,
    },
    emptyContainer: {
        padding: 32,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
    },
});
