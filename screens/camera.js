import React from "react";
import{Button,View,Text,Platform} from "react-native"
import * as ImagePicker from "expo-image-picker"
import * as Permissions from "expo-permissions"

export default class PickImage extends React.Component{
    state = {
        image:null
    }
    render(){
        let {image} = this.state
        return(
            <View>
                <Button
                    title = "Pick an Image from Gallery"
                    onPress = {this._pickImage}
                />
            </View>
        )
    }

    componentDidMount(){
        this.getPermissionAsync()
    }

    getPermissionAsync =async ()=>{
        if(Platform.OS !== "web"){
            const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL)
            if(status !== "granted"){
                alert("Sorry We Need Camera Permissions To Make This App Work")
            }
        }
    }
    _pickImage = async ()=>{
        try{
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes : ImagePicker.MediaTypeOptions.All,
                allowsEditing : true,
                aspect : [4,3],
                quality : 1,
            })
            if(!result.cancelled){
                this.setState({
                    image : result.data
                })
                this.uploadImage(result.uri)
            }
        }
        catch(E){
            console.log(E)
        }
    }
    uploadImage = async (uri)=>{
        const data  = new FormData()
        let filename =  uri.split("/")[uri.split("/").length-1]
        let type = `image/${uri.split(".")[uri.split(".").length-1]}`
        const fileToUpload = {
            uri:uri,
            name:filename,
            type:type
        }
        data.append("alphabet",fileToUpload)
        fetch("http://ae61-122-173-163-156.ngrok.io/predict-alphabet",{
            method:"POST",
            body:data,
            headers:{
                "content-type":"multipart/form-data"
            }
        })
        .then((response)=>response.json())
        .then((response)=>{
            console.log("Success : ",result)
        })
        .catch((error)=>{
            console.log("Error : ",error)
        })
    }
}