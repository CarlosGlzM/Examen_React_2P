import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, TextInput, Button } from 'react-native';
import {validateEmail} from "../utils/validation";
import firebase from '../utils/firebase';

export default function Cotizador({user:{email}}){
const [validation, setValidation] = useState(false);
const [calculoFinal, setCalculoFinal] = useState({
    cantidadSolicitada:0,
    interesFinal: 0,
    ivaFinal:0,
    PagoMensualfinal:0
});
return <>{validation ? <Resumen  email={email} calculoFinal={calculoFinal}/> : <Sueldo validation={validation} setValidation={setValidation} calculoFinal={calculoFinal} setCalculoFinal={setCalculoFinal}/>}</>;
    
}

function Sueldo({validation, setValidation, calculoFinal, setCalculoFinal}){
   
    const [cantidad,setCantidad] = useState({
        sueldo:0,
        prestamo:0,
    });
    const[mensualidad,setMensualidad] = useState({
     tresMeses: styles.mesesInactive,
     seisMeses: styles.mesesInactive,
     nueveMeses: styles.mesesInactive,
     doceMeses: styles.mesesInactive,
     veinticuatroM : styles.mesesInactive
    });
    const [mensualidadSelected, setMensualidadSelected]= useState(3);

    useEffect(()=>{
        
        if (cantidad.sueldo >= 1 && cantidad.sueldo <=10000){
        setMensualidad({...mensualidad, 
                tresMeses: styles.mesesActive, 
                seisMeses: styles.mesesActive });
        console.log(mensualidad);
        console.log(cantidad.sueldo);
        }else if (cantidad.sueldo > 10000 && cantidad.sueldo <= 20000){
            setMensualidad({...mensualidad, 
                tresMeses: styles.mesesActive, 
                seisMeses: styles.mesesActive, 
                nueveMeses:styles.mesesActive });
        }else if (cantidad.sueldo > 20000){
            setMensualidad({...mensualidad, 
                tresMeses: styles.mesesActive, 
                seisMeses: styles.mesesActive, 
                nueveMeses:styles.mesesActive, 
                doceMeses: styles.mesesActive, 
                veinticuatroM: styles.mesesActive });
        }
    },[cantidad.sueldo]);


    const logout = ()=>{
        firebase.auth().signOut();
      }

    const Cotizacion =() =>{
        let userSueldo = cantidad.sueldo;
        let userPrestamo = cantidad.prestamo;
        let userMeses = mensualidadSelected;
        let iva = 0.16;
        let impuesto = 0;
        
        if (userSueldo > 1 && userSueldo <= 10000){
            impuesto = 0.02;
        }else if (userSueldo > 10000 && userSueldo <= 20000){
            impuesto = 0.04;
        }else if (userSueldo > 20000){
            impuesto = 0.06;
        }

        let solointeres = userPrestamo * impuesto;
        
        let interesTotal = (impuesto * userPrestamo) + userPrestamo;
        let ivaTotal = (iva * interesTotal) + interesTotal;
        let soloiva = iva * interesTotal;
        let pagoMensual =  ivaTotal / userMeses;

        setCalculoFinal({...calculoFinal,
            cantidadSolicitada: userPrestamo,
            interesFinal: solointeres,
            ivaFinal:soloiva,
            PagoMensualfinal: pagoMensual
        })
        console.log(calculoFinal)
    }
    return (
        <>
        <View>
            <Text style={[styles.subtitle]}>Ingresa tu Sueldo</Text>
            <TextInput
             style={styles.input}
             placeholder="Sueldo"
             keyboardType="numeric"
             onChange={(e) => setCantidad({...cantidad, sueldo:parseFloat(e.nativeEvent.text)})}
            />
            <Text style={[styles.subtitle]}>Ingrese Prestamo Necesario</Text>
            <TextInput
             style={styles.input}
             placeholder="Prestamo"
             keyboardType="numeric"
             onChange={(e) => setCantidad({...cantidad, prestamo:parseFloat(e.nativeEvent.text)})}
            />
            <Text style={[styles.subtitle]}>Meses</Text>
           <View style={[styles.ViewButtons]}>
            <TouchableOpacity 
            style={[styles.buttons, 
            mensualidad.tresMeses]}
            onPress={()=>{setMensualidadSelected(3)
            Cotizacion();
            }}
            >3</TouchableOpacity>

            <TouchableOpacity 
            style={[styles.buttons, 
            mensualidad.seisMeses]}
            onPress={()=>{setMensualidadSelected(6)
            Cotizacion();
            }}
            >6</TouchableOpacity>

            <TouchableOpacity 
            style={[styles.buttons, 
            mensualidad.nueveMeses]}
            onPress={()=>{setMensualidadSelected(9)
            Cotizacion();
            }}
            >9</TouchableOpacity>

            <TouchableOpacity 
            style={[styles.buttons, 
            mensualidad.doceMeses]}
            onPress={()=>{setMensualidadSelected(12)
            Cotizacion();
            }}
            >12</TouchableOpacity>

            <TouchableOpacity 
            style={[styles.buttons,
            mensualidad.veinticuatroM]}
            onPress={()=>{setMensualidadSelected(24)
            Cotizacion();
            }}
            >24</TouchableOpacity>
           </View>
           <Text style={[styles.subtitle]}>{calculoFinal.PagoMensualfinal === 0 ? 'Pago Mensual' : `Pago Mensual: ${calculoFinal.PagoMensualfinal}`}</Text>
           <Button title = "Resumen" onPress={()=>setValidation(!validation)}></Button>
           <Button title = "cerrar sesión" onPress={logout}></Button>
        </View>
           
        </>
    );

}
function Resumen({email,calculoFinal:{cantidadSolicitada, interesFinal, ivaFinal, PagoMensualfinal}}){
    const logout = ()=>{
        firebase.auth().signOut();
      }
    return(
    <View>
        <Text style={[styles.subtitle]}>{`Usuario: ${email}`}</Text>
        <Text style={[styles.subtitle]}>{`Cantidad Solicitada: ${cantidadSolicitada}`}</Text>
        <Text style={[styles.subtitle]}>{`Interes: ${interesFinal}`}</Text>
        <Text style={[styles.subtitle]}>{`IVA: ${ivaFinal}`}</Text>
        <Text style={[styles.subtitle]}>{`Pago Mensual: ${PagoMensualfinal}`}</Text>
        <Button title = "cerrar sesión" onPress={logout}></Button>
    </View>
    );
}
const styles = StyleSheet.create({
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        borderRadius:10,
        borderColor:'white',
        color:'white',
    },
    ViewPrincipal: {
        height: 40,
        margin: 12,
        borderWidth: 1,
      },
    ViewButtons: {
        width: '100%',
        height: 80,
        justifyContent: 'space-around',
        flexDirection: "row",
        flexWrap: "wrap",
      },  
    buttons: {
        alignItems:'center',
        justifyContent:'space-around',
        width:50,
        height:50,
        borderRadius:10,
        backgroundColor: '#008AFF',
        fontFamily: '',
        fontSize: 20,
        fontWeight:'bold',
        color:'white',
      },
      subtitle: {
        textAlign:'center',
        margin:10,
        fontFamily: '',
        fontSize: 20,
        fontWeight:'bold',
        color:'white',
      },
      mesesActive:{
          display:"flex"
      },
      mesesInactive:{
          display:"none"
      }    
  });