import React from "react";
import { TextInput } from "react-native";
import InputFieldStyle from "./inputField.style";

type Props = {};

const InputField = (props: React.ComponentProps<typeof TextInput>) => {
    return (
        <TextInput
            style={styles.inputField}
            {...props}
        />
    )
}

const styles = InputFieldStyle;

export default InputField;