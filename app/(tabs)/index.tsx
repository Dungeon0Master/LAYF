import React, { useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Esquema de validación con Yup
const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Correo electrónico inválido').required('El correo es requerido'),
  password: Yup.string().min(6, 'La contraseña debe tener al menos 6 caracteres').required('La contraseña es requerida'),
});

// Interfaz para los valores del formulario
interface LoginFormValues {
  email: string;
  password: string;
}

// Función para guardar la sesión en el AsyncStorage
const saveSession = async (token: string) => {
  try {
    await AsyncStorage.setItem('userToken', token);
  } catch (error) {
    console.log(error);
  }
};

// Función para obtener la sesión guardada en el AsyncStorage
const getSession = async () => {
  try {
    return await AsyncStorage.getItem('userToken');
  } catch (error) {
    console.log(error);
  }
};

// Función para eliminar la sesión guardada en el AsyncStorage
const removeSession = async () => {
  try {
    await AsyncStorage.removeItem('userToken');
  } catch (error) {
    console.log(error);
  }
};

const LoginScreen = () => {
  // Verificar si el usuario ya tiene una sesión activa al cargar la pantalla
  useEffect(() => {
    const checkSession = async () => {
      const token = await getSession();
      if (token) {
        Alert.alert('Sesión activa', 'Ya tienes una sesión iniciada.');
      }
    };
    checkSession();
  }, []);

  const handleLogin = async (values: LoginFormValues) => {
    // Simulación de credenciales válidas
    if (values.email === 'admin@example.com' && values.password === '123456') {
      try {
        // Guardar el token en AsyncStorage
        await saveSession('dummyToken');
        Alert.alert('Login exitoso', 'Bienvenido a la aplicación');
      } catch (error) {
        console.log(error);
      }
    } else {
      Alert.alert('Error', 'Credenciales incorrectas');
    }
  };

  const handleLogout = async () => {
    try {
      await removeSession();
      Alert.alert('Sesión cerrada', 'Has cerrado sesión correctamente.');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={LoginSchema}
        onSubmit={handleLogin}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <>
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
            />
            {touched.email && errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              placeholderTextColor="#999"
              secureTextEntry
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
            />
            {touched.password && errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Ingresar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.buttonText}>Cerrar sesión</Text>
            </TouchableOpacity>
          </>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212', // Fondo oscuro
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff', // Texto blanco
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#333', // Borde más oscuro
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#1e1e1e', // Fondo del input oscuro
    color: '#fff', // Texto blanco
  },
  button: {
    width: '100%',
    backgroundColor: '#ff0000', // Botón rojo
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  logoutButton: {
    width: '100%',
    backgroundColor: '#444', // Botón gris para cerrar sesión
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff', // Texto blanco
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#ff4444', // Texto de error en rojo claro
    marginBottom: 10,
  },
});

export default LoginScreen;