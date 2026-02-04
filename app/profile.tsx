import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from 'expo-router';
import useUserSignUp from "./userSignUp";
import RNPickerSelect from 'react-native-picker-select';
import Header from './header';

export default function ProfileScreen() {
    // 1. Get Data and Setter from Zustand
    const { userData, setUserData } = useUserSignUp();
    
    // 2. Local State for Editing
    const [isEditing, setIsEditing] = useState(false);
    const [editEmail, setEditEmail] = useState(userData.email);
    const [editPhone, setEditPhone] = useState(userData.phone_no);
    const [editCountry, setEditCountry] = useState(userData.selectedCountry);

    // Sync local state when userData changes (e.g., after initial load)
    useEffect(() => {
        setEditEmail(userData.email);
        setEditPhone(userData.phone_no);
        setEditCountry(userData.selectedCountry);
    }, [userData]);

    const countries = [
        { label: 'Nigeria', value: 'NG' },
        { label: 'United States', value: 'US' },
        { label: 'United Kingdom', value: 'UK' },
        { label: 'Canada', value: 'CA' },
    ];

    const handleSave = () => {
        // Update Zustand Store - Passing all 6 required arguments
        setUserData(
            userData.fname, 
            userData.lname, 
            editEmail, 
            editPhone.toString(), 
            editCountry, 
            userData.password // Keeping the existing password
        );
        setIsEditing(false);
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header style={styles.heada} />
            <ScrollView contentContainerStyle={styles.greetTextDive}>
                <Text style={styles.greetText}>Profile Details</Text>
                
                <View style={styles.infoBox}>
                    <Text style={styles.label}>First Name: {userData.fname}</Text>
                    <Text style={styles.label}>Last Name: {userData.lname}</Text>

                    {/* Editable Email */}
                    <Text style={styles.subLabel}>Email:</Text>
                    {isEditing ? (
                        <TextInput 
                            style={styles.input} 
                            value={editEmail} 
                            onChangeText={setEditEmail} 
                            keyboardType="email-address"
                        />
                    ) : (
                        <Text style={styles.valueText}>{userData.email}</Text>
                    )}

                    {/* Editable Phone */}
                    <Text style={styles.subLabel}>Phone No:</Text>
                    {isEditing ? (
                        <TextInput 
                            style={styles.input} 
                            value={editPhone} 
                            onChangeText={setEditPhone} 
                            keyboardType="phone-pad"
                        />
                    ) : (
                        <Text style={styles.valueText}>{userData.phone_no}</Text>
                    )}

                    {/* Editable Country */}
                    <Text style={styles.subLabel}>Country:</Text>
                    {isEditing ? (
                        <RNPickerSelect
                            onValueChange={(value) => setEditCountry(value)}
                            items={countries}
                            value={editCountry}
                            style={pickerStyles}
                        />
                    ) : (
                        <Text style={styles.valueText}>{userData.selectedCountry}</Text>
                    )}
                </View>

                <View style={styles.buttonContainer}>
                    <Button 
                        title={isEditing ? "Save Changes" : "Edit Profile"} 
                        onPress={isEditing ? handleSave : () => setIsEditing(true)} 
                        color={isEditing ? "#4CAF50" : "#2196F3"}
                    />
                    
                    <View style={{ marginTop: 10 }}>
                        <Button title='Go to Login' onPress={() => router.replace('/login')} />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    heada: {
        marginTop: 0,
        marginBottom: 40,
        backgroundColor: 'red',
        alignSelf: 'center',
    },
    container: {
        flex: 1,
        backgroundColor: 'rgba(118, 172, 216, 1)',
    },
    greetTextDive: {
        alignItems: 'center',
        paddingVertical: 50,
    },
    greetText: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    infoBox: {
        width: '85%',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 15,
        elevation: 5,
    },
    label: {
        fontSize: 18,
        marginBottom: 10,
        fontWeight: '600',
    },
    subLabel: {
        fontSize: 14,
        color: '#555',
        marginTop: 10,
    },
    valueText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: '#3b82f6',
        fontSize: 16,
        paddingVertical: 5,
        color: 'blue',
    },
    buttonContainer: {
        marginTop: 30,
        width: '85%',
    }
});

const pickerStyles = {
    inputAndroid: { color: 'blue', fontSize: 16, paddingVertical: 10 },
    inputIOS: { color: 'blue', fontSize: 16, paddingVertical: 10 }
};