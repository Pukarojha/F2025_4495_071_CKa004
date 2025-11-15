import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import CountryPicker from 'react-native-country-picker-modal';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const H_PADDING = width < 400 ? 10 : 22; // adaptive for different screens

function FloatingLabelInput({ label, value, onChangeText, style, ...props }) {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <View style={[styles.floatWrap, style]}>
      <Text style={[
        styles.floatingLabel,
        (isFocused || value) && styles.floatingLabelFocused
      ]}>
        {label}
      </Text>
      <TextInput
        {...props}
        value={value}
        onChangeText={onChangeText}
        style={styles.floatInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        selectionColor="#2684FF"
        placeholder=""
      />
    </View>
  );
}

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const onProfileUpdate = route.params?.onProfileUpdate;

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState({ name: '', cca2: 'US' });
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [address2, setAddress2] = useState('');
  const [zip, setZip] = useState('');

  const submit = () => {
    if (!fullName.trim() || !username.trim() || !email.trim()) {
      Alert.alert('Required Fields', 'Please fill in at least Full Name, Username, and Email.');
      return;
    }

    if (onProfileUpdate) {
      onProfileUpdate({
        fullName: fullName.trim(),
        username: username.trim(),
        email: email.trim(),
      });
    }

    Alert.alert('Profile Submitted', 'Your profile has been updated!');
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#eef5fa" }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIcon}>
          <Ionicons name="arrow-back" size={25} color="#222" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit profile</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIcon}>
          <Ionicons name="close" size={27} color="#222" />
        </TouchableOpacity>
      </View>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingHorizontal: H_PADDING }
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={true}
      >
        <FloatingLabelInput
          label="Full name"
          value={fullName}
          onChangeText={setFullName}
          autoCapitalize="words"
        />
        <FloatingLabelInput
          label="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        <FloatingLabelInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <FloatingLabelInput
          label="Gender"
          value={gender}
          onChangeText={setGender}
        />

        {/* Phone with country flag and picker */}
        <View style={styles.phoneFieldWrapper}>
          <TouchableOpacity
            style={styles.flagPicker}
            onPress={() => setShowCountryPicker(true)}
            activeOpacity={0.8}
          >
            <CountryPicker
              countryCode={country.cca2}
              withFlag
              withFilter
              withAlphaFilter
              withCallingCode
              withEmoji
              visible={showCountryPicker}
              onSelect={value => {
                setCountry({
                  name: value.name,
                  cca2: value.cca2
                });
                setShowCountryPicker(false);
              }}
              onClose={() => setShowCountryPicker(false)}
            />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.phoneLabel}>Phone number</Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              style={styles.phoneInput}
              placeholder=""
            />
          </View>
        </View>

        {/* Country and City side-by-side */}
        <View style={styles.rowGroup}>
          <TouchableOpacity
            style={[
              styles.floatWrap, {
                flex: 1, marginRight: 8, flexDirection:'row', alignItems: 'center', minWidth: 0
              }
            ]}
            onPress={() => setShowCountryPicker(true)}
            activeOpacity={0.85}
          >
            <Text style={[
              styles.floatingLabel,
              country.name && styles.floatingLabelFocused
            ]}>Country</Text>
            <TextInput
              value={country.name}
              editable={false}
              style={[styles.floatInput, { paddingRight: 30 }]}
              pointerEvents="none"
            />
            <Ionicons name="chevron-down" size={17} color="#777" style={{position: 'absolute', right: 18, top: '50%', marginTop: -8}}/>
          </TouchableOpacity>
          <View style={{ flex: 1, minWidth: 0 }}>
            <FloatingLabelInput
              label="City"
              value={city}
              onChangeText={setCity}
            />
          </View>
        </View>

        <FloatingLabelInput
          label="Address line 1"
          value={address}
          onChangeText={setAddress}
        />
        <FloatingLabelInput
          label="Address line 2 (optional)"
          value={address2}
          onChangeText={setAddress2}
        />
        <FloatingLabelInput
          label="Zip Code"
          value={zip}
          onChangeText={setZip}
          keyboardType="number-pad"
        />

        <TouchableOpacity style={[styles.submit, { width: "100%", alignSelf: "center" }]} onPress={submit}>
          <Text style={styles.submitText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 55,
    marginBottom: 5,
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    backgroundColor: "#eef5fa",
  },
  headerTitle: {
    fontWeight: 'bold',
    fontSize: 27,
    textAlign: 'center',
    flex: 1,
    color: "#18171d",
    letterSpacing: 0.05,
  },
  headerIcon: { width: 40, alignItems: "center", justifyContent: "center" },
  content: {
    paddingTop: 3,
    paddingBottom: 32,
    backgroundColor: "#eef5fa"
  },
  floatWrap: {
    marginBottom: 16,
    minHeight: 54,
    justifyContent: 'center',
    flex: 1,
  },
  floatingLabel: {
    position: 'absolute',
    left: 15,
    top: 16,
    zIndex: 2,
    color: '#a7a7a7',
    fontSize: 16,
    fontWeight: '400',
  },
  floatingLabelFocused: {
    top: 7,
    fontSize: 12.5,
    color: "#37a"
  },
  floatInput: {
    backgroundColor: "#fff",
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: "#b8bec4",
    paddingTop: 22,
    paddingBottom: 6,
    paddingHorizontal: 15,
    fontSize: 17.7,
    color: "#131520",
    fontWeight: "500",
    height: 54,
    letterSpacing: 0.1,
    minWidth: 0,
    flex: 1,
  },
  phoneFieldWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: "#b8bec4",
    backgroundColor: "#fff",
    marginBottom: 15,
    paddingLeft: 10,
    paddingRight: 4,
    paddingVertical: 6,
    minHeight: 56,
    minWidth: 0,
  },
  flagPicker: {
    marginRight: 7,
    paddingVertical: 4,
    paddingHorizontal: 3,
    borderRadius: 7
  },
  phoneLabel: {
    color: "#a7a7a7",
    fontSize: 15.4,
    fontWeight: "500",
    marginLeft: 3
  },
  phoneInput: {
    fontSize: 21.7,
    color: "#191e23",
    fontWeight: "600",
    marginLeft: 2,
    marginTop: 3,
    backgroundColor: "transparent",
    borderWidth: 0,
    paddingVertical: 0,
    paddingHorizontal: 0,
    width: '100%',
    minWidth: 0,
  },
  rowGroup: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 9,
    minHeight: 56,
    width: "100%",
  },
  submit: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: "#10A9C2",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 25,
    marginBottom: 36,
    elevation: 2,
    minWidth: 0,
  },
  submitText: { color: "#fff", fontWeight: "bold", fontSize: 19.5, letterSpacing: 0.25 },
});
