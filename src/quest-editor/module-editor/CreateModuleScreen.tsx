import React, { useState, useRef, useEffect } from "react";
import { Dimensions, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { StoryModule } from "./module-views/StoryModule";
import { EndingModule } from "./module-views/EndingModule";
import { ChoiceModule } from "./module-views/ChoiceModule";
import { useAppDispatch } from "../../redux/hooks";
import { useNavigation, useRoute } from "@react-navigation/core";
import { addOrUpdateQuestModule } from "../../redux/editor/editorSlice";
import { ModuleTypeChoice } from "./ModuleTypeChoice";
import { PreviewModuleScreen } from "./PreviewModuleScreen";
import { RouteProp } from "@react-navigation/native";
import { PrototypeComponent, PrototypeModule, PrototypeModuleBase } from "../../types/prototypes";
import { LocationModule } from "./module-views/LocationModule";
import { ComponentCreateScreen } from "./ComponentCreateScreen";
import { useCallback } from "react";
import { RandomModule } from "./module-views/RandomModule";
import { PassphraseModule } from "./module-views/PassphraseModule";
import { QRModule } from "./module-views/QRModule";
import { Button, Dialog, Paragraph, Portal } from "react-native-paper";
import { Colors } from "../../styles";

const displayWidth = Dimensions.get("screen").width;

export interface ICreateModule<ModuleType extends PrototypeModuleBase> {
  setFinalModule: (finalModule: PrototypeModule) => void;
  edit?: boolean;
  defaultValues?: ModuleType;
  setComponents: React.Dispatch<React.SetStateAction<PrototypeComponent[]>>,
  scrollToPreview: () => void
}

export interface IModuleBase {
  objective: string;
  type: string;
  components: PrototypeComponent[];
  choices?: {
    text: string;
    nextModuleReference: number | null;
  }[];
  endingFactor?: number;
}

export const CreateModuleScreen = () => {
  const [chosenModuleType, setChosenModuleType] = useState("");
  const [finalModule, setFinalModule] = useState<PrototypeModule>();
  const [components, setComponents] = useState<PrototypeComponent[]>([]);
  const [moduleTypeUpdate, setModuleTypeUpdate] = useState<boolean>(false);

  const route = useRoute<RouteProp<{
          params: {
            moduleId: number;
            insertModuleId: () => void;
          };
        }, "params">>();
  const navigation = useNavigation();

  const swiper = useRef<ScrollView | null>(null);

  const dispatch = useAppDispatch();

  const saveModule = (finalModule: PrototypeModule) => {
    const baseModule = {
      id: route.params?.moduleId,
    };

    setFinalModule(finalModule)
    //setFinalModule({ ...finalModule, ...baseModule, components: components });
  };

  const [combinedModule, setCombinedModule] = useState<PrototypeModule>();

  const unsavedChangesRef = useRef<boolean>(false)
  const [showDialog, setShowDialog] = useState<any | undefined>();

  useEffect(() => {
    unsavedChangesRef.current = chosenModuleType !== ''
  }, [chosenModuleType])

  useEffect(() => {
    navigation.addListener('beforeRemove', (e) => {
      if (unsavedChangesRef.current) {
        e.preventDefault();
        setShowDialog(() => e.data.action)
      }
    })
  }, [])

  useEffect(() => {
    const baseModule = {
      id: route.params?.moduleId,
    };
    if (finalModule) {
      setCombinedModule({...finalModule, ...baseModule, components: components})
    }
  }, [finalModule, route.params.moduleId, components])

  const modules = ["Story", "Ending", "Choice", "Location", "Random", "Passphrase", "QrCode", "WideArea"];

  const scrollToPreview = useCallback(() => {
    swiper.current?.scrollTo({
      x: 3 * displayWidth,
    })}, [swiper])

  const moduleMap: { [moduleName: string]: JSX.Element } = {
    Story: <StoryModule setFinalModule={saveModule} setComponents={setComponents} scrollToPreview={scrollToPreview} />,
    Ending: <EndingModule setFinalModule={saveModule} setComponents={setComponents} scrollToPreview={scrollToPreview} />,
    Choice: <ChoiceModule setFinalModule={saveModule} setComponents={setComponents} scrollToPreview={scrollToPreview} />,
    Location: <LocationModule setFinalModule={saveModule} setComponents={setComponents} scrollToPreview={scrollToPreview}/>,
    Random: <RandomModule setFinalModule={saveModule} setComponents={setComponents} scrollToPreview={scrollToPreview}/>,
    Passphrase: <PassphraseModule setFinalModule={saveModule} setComponents={setComponents} scrollToPreview={scrollToPreview}/>,
    QrCode: <QRModule setFinalModule={saveModule} setComponents={setComponents} scrollToPreview={scrollToPreview}/>,
  };

  useEffect(() => {
    swiper.current?.scrollTo({
      x: displayWidth,
    });
  }, [moduleTypeUpdate]); 

  return (
    <View style={{ margin: 0, borderColor: "black", flexGrow: 1 }}>
      <Portal>
        <Dialog visible={showDialog!==undefined} onDismiss={() => setShowDialog(undefined)}>
          <Dialog.Title>Leave Module Editor?</Dialog.Title>
          <Dialog.Content>
            <Paragraph>Everything not saved will be lost.</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button color={Colors.primary} onPress={() => setShowDialog(undefined)}>Stay</Button>
            <Button color={Colors.primary} onPress={() => {setShowDialog(undefined); navigation.dispatch(showDialog)}}>Drop Changes</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator
        ref={swiper}
      >
        <ModuleTypeChoice
          chosenModuleType={chosenModuleType}
          modules={modules}
          setChosenModuleType={(moduleType) => {setChosenModuleType(moduleType); setModuleTypeUpdate(x => !x)}}
          swiper={swiper}
        />
        {chosenModuleType !== '' && 
          <ComponentCreateScreen 
            components={components}
            setComponents={setComponents}
            onConfirm={() => swiper.current?.scrollTo({x: 2*displayWidth})}

          />}
        {chosenModuleType in moduleMap && (
          <ScrollView style={{ width: displayWidth, margin: 0, padding: 0 }}>
            {moduleMap[chosenModuleType]}
          </ScrollView>
        )}
        {combinedModule && (
          <View style={{width: displayWidth}}>
          <PreviewModuleScreen
            prototypeModule={combinedModule}
            saveModule={() => {
              route.params?.insertModuleId();
              dispatch(addOrUpdateQuestModule(combinedModule));
              navigation.navigate("ModuleGraph");
            }}
          />
          </View>
        )}
      </ScrollView>
    </View>
  );
};
