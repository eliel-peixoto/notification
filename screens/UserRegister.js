// UserRegister.js
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';
import { supabase } from '../supabase'; // <--- 1. Importar Supabase
import { registerForPushNotificationsAsync } from '../notificationService'; // <--- 2. Importar o Token


const UserRegister = ({navigation}) => {

    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        setLoading(true);
        
        // 1. Obter o Token do Dispositivo antes de tudo
        const tokenDispositivo = await registerForPushNotificationsAsync(); 
        
        try {
            // 2. Autenticar (Salva email/senha e gera o ID)
            const { 
                data: { user },
                error: signUpError 
            } = await supabase.auth.signUp({
                email: email,
                password: senha, // Use 'senha' aqui
            });

            if (signUpError) {
                // Erros de autenticação (ex: email já cadastrado, senha fraca)
                throw signUpError; 
            }

            // 3. Salvar o Perfil (nome e token)
            const userId = user.id;

            const { error: profileError } = await supabase
                .from('profiles')
                .insert([
                    { 
                        user_id: userId,
                        nome: nome,
                        token_dispositivo: tokenDispositivo // Pode ser null
                    }
                ]);

            if (profileError) {
                // Erros no banco de dados (ex: NOT NULL violado)
                console.error("Erro ao salvar o perfil:", profileError);
                Alert.alert("Erro no Cadastro", "Usuário criado, mas erro ao salvar dados de perfil.");
            } else {
                Alert.alert("Sucesso!", "Cadastro realizado com sucesso! Verifique seu email para confirmar.");
                // navigation.goBack(); // Navegue para a tela de login ou home
            }
            
        } catch (error){
            console.error('Erro total no cadastro', error);
            Alert.alert("Erro no Cadastro", error.message || 'Ocorreu um erro desconhecido.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <Text style={{ fontSize: 24, marginBottom: 20 }}>Novo Usuário</Text>
            
            <TextInput
                style={styles.input}
                placeholder="Nome"
                value={nome}
                onChangeText={setNome}
            />

            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <TextInput
                style={styles.input}
                placeholder="Senha"
                value={senha}
                onChangeText={setSenha}
                secureTextEntry
            />

            <Button 
                title={loading ? 'Carregando...' : 'Cadastrar'} 
                onPress={handleSave}
                disabled={loading}
            />
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 15,
        paddingHorizontal: 10,
        borderRadius: 5,
    }
})

export default UserRegister;