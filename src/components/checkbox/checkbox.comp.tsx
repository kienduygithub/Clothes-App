import { CommonColors } from "@/src/common/resource/colors";
import { TouchableOpacity } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";

type Props = {
    stateChecked: boolean,
    toggleCheckedFunc: (isChecked: boolean) => void
}

const CheckboxComponent = ({ stateChecked, toggleCheckedFunc }: Props) => {

    return (
        <TouchableOpacity>
            <BouncyCheckbox
                size={24}
                fillColor={CommonColors.primary}
                unFillColor={CommonColors.white}
                isChecked={stateChecked}
                onPress={(isChecked: boolean) => toggleCheckedFunc(isChecked)}
                iconStyle={{ borderColor: CommonColors.primary, borderRadius: 3 }}
                innerIconStyle={{ borderWidth: 1, borderRadius: 3 }}
            />
        </TouchableOpacity>
    )
}

export default CheckboxComponent;