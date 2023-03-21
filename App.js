import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableWithoutFeedback, Keyboard, TouchableOpacity, Image, Alert   } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {Picker} from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
const Form = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [number, setNumber] = useState('');
  const [type, setType] = useState('pesel');
  const [image,setImage] = useState(null)

  const isValidNIP = (input) => {
    const regex = /^\d{10}$/; // regular expression to match 10 digits
    return regex.test(input);
  };

  const isValidPESEL = (input) => {
    const regex = /^\d{11}$/; // regular expression to match 11 digits
    return regex.test(input);
  };

  const handleSubmit = async () => {
    if (type === 'nip' && !isValidNIP(number)) {
      Alert.alert('Nieprawidłowy NIP');
      return;
    } else if (type === 'pesel' && !isValidPESEL(number)) {
      Alert.alert('Nieprawidłowy PESEL');
      return;
    }

    const nameRegex = /^[a-zA-Z]{3,}$/; // regular expression to match only letters and a minimum of 3 characters
    if (!nameRegex.test(firstName)) {
      Alert.alert('Imię musi posiadać przynajmniej 3 litery');
      return;
    }
    if (!nameRegex.test(lastName)) {
      Alert.alert('Nazwisko musi posiadać przynajmniej 3 litery');
      return;
    }

    /// console.log(firstName, lastName, number, type, image);
    
     try {
    const response = await fetch('https://localhost:60001/Contractor/Save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        firstName,
        lastName,
        number,
        type,
        image
      })
    });
    if (response.status === 200) {
      Alert.alert('Kontrahent dodany pomyślnie');
      setFirstName('');
      setLastName('');
      setNumber('');
      setType('pesel');
      setImage(null);
    } else {
      Alert.alert('Nie można dodać kontrahenta');
    }
  } catch (error) {
    Alert.alert('Nie znaleziono metody zapisu');
    console.log(error);
  }
};

    
  

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [1, 1],
      quality: 1,
      allowsEditing:true
    });
    if (!result.canceled) {
      const imageType = result.assets[0].uri.split('.').pop();
      if (imageType !== 'jpg' && imageType !== 'jpeg') {
        Alert.alert('Zdjęcie w nieodpowiednim formacie');
        return;
      }
      ///console.log(result.assets[0].height) - do przetestowania na androidzie
      ///console.log(result.assets[0].width) - do przetestowania na androidzie
      setImage(result.assets[0].uri);

    }
  };
  

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <View style={styles.container}>
      <Text style={styles.title}>Dodaj kontrahenta:</Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Imię"
          value={firstName}
          onChangeText={setFirstName}
          style={styles.input}
        />
        <TextInput
          placeholder="Nazwisko"
          value={lastName}
          onChangeText={setLastName}
          style={styles.input}
        />
        <TextInput
          placeholder="Numer identyfikacyjny"
          value={number}
          onChangeText={setNumber}
          keyboardType="numeric"
          style={styles.input}
        />
      </View>

      <View>
        <Picker 
            style={styles.picker}
            selectedValue={type}
            onValueChange={(itemValue, itemIndex) =>
              setType(itemValue)
            }>
            <Picker.Item label="Osoba" value="pesel" />
            <Picker.Item label="Firma" value="nip" />
        </Picker>
      </View>

      <View style={styles.imagecontainer}>
        <StatusBar hidden={true} />
        {image && <Image source={{uri:image}} style={styles.image} />}
        
        <TouchableOpacity onPress={pickImage} style={styles.button}>
        <Text style={styles.buttonText}>Wybierz zdjęcie</Text>
        </TouchableOpacity>   
        <StatusBar style="auto" />
      </View>      

      <TouchableOpacity onPress={handleSubmit} style={styles.buttonSubmit}>
        <Text style={styles.buttonText}>Dodaj</Text>
      </TouchableOpacity>         

      </View>
    
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fdf',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    width: '80%',
    
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonSubmit: {
    backgroundColor: '#aaa',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  picker: {
    marginVertical: 10,
    width: 300,
    padding: 10,
    paddingTop: 100,
    paddingBottom: 50,
    height: 100,
    justifyContent: 'center',
  },
  image: {
    width: 200,
    height: 200,
  },
  imagecontainer: {
     alignItems: 'center',
     justifyContent: 'center',
  }
});

export default Form;