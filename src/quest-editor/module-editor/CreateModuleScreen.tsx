import React, { useState, useRef, useEffect } from "react";
import { Dimensions, View } from "react-native";
import { ScrollView, TouchableHighlight } from "react-native-gesture-handler";
import { StoryModule } from "./module-views/StoryModule";
import { EndingModule } from "./module-views/EndingModule";
import { ChoiceModule } from "./module-views/ChoiceModule";
import {
  PrototypeComponent,
  PrototypeModule,
  PrototypeModuleBase,
} from "../../types/quest";
import { useAppDispatch } from "../../redux/hooks";
import { useNavigation, useRoute } from "@react-navigation/core";
import { addOrUpdateQuestModule } from "../../redux/editor/editorSlice";
import StepIndicator from "react-native-step-indicator";
import { ModuleTypeChoice } from "./ModuleTypeChoice";
import { PreviewModuleScreen } from "./PreviewModuleScreen";
import { RouteProp } from "@react-navigation/native";
import { InternalFullNode } from "../graph/utils/linksParser";

const displayWidth = Dimensions.get("screen").width;

export interface ICreateModule<ModuleType extends PrototypeModuleBase> {
  setFinalModule: (finalModule: PrototypeModule) => void;
  edit?: boolean;
  defaultValues?: ModuleType;
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

    setFinalModule({ ...finalModule, ...baseModule });
  };

  const modules = ["Location", "Choice", "Story", "Ending"];

  const moduleMap: { [moduleName: string]: JSX.Element } = {
    Story: <StoryModule setFinalModule={saveModule} />,
    Ending: <EndingModule setFinalModule={saveModule} />,
    Choice: <ChoiceModule setFinalModule={saveModule} />,
  };

  useEffect(() => {
    swiper.current?.scrollTo({
      x: 2 * displayWidth,
    });
  }, [finalModule]);

  useEffect(() => {
    swiper.current?.scrollTo({
      x: displayWidth,
    });
  }, [chosenModuleType]);

  return (
    <View style={{ margin: 0, borderColor: "black", flexGrow: 1 }}>
      {/*<StepIndicator 
      customStyles={customStyles} 
      labels={['Choose\nModule Type', 'Choose Module Properties', 'Create\nModule']}
      currentPosition={currentIndex}
    stepCount={3}/>*/}
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator
        ref={swiper}
      >
        <ModuleTypeChoice
          chosenModuleType={chosenModuleType}
          modules={modules}
          setChosenModuleType={setChosenModuleType}
          swiper={swiper}
        />
        {chosenModuleType in moduleMap && (
          <ScrollView style={{ width: displayWidth, margin: 0, padding: 0 }}>
            {moduleMap[chosenModuleType]}
          </ScrollView>
        )}
        {finalModule && (
          <PreviewModuleScreen
            prototypeModule={finalModule}
            saveModule={() => {
              console.log('Preinsert CMS')
              route.params?.insertModuleId();
              dispatch(addOrUpdateQuestModule(finalModule));
              console.log('Postinsert CMS')
              navigation.navigate("ModuleGraph");
            }}
          />
        )}
      </ScrollView>
    </View>
  );
};
