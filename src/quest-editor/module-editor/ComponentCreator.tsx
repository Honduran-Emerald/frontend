import React from 'react';
import { View } from 'react-native';
import { IconButton, TextInput } from 'react-native-paper';
import { Colors } from '../../styles';
import { PrototypeComponent } from '../../types/prototypes';
import { ImageReferencePicker } from './ImageReferencePicker';


interface ComponentCreatorProps {
  components: PrototypeComponent[],
  setComponents: React.Dispatch<React.SetStateAction<PrototypeComponent[]>>,
}

const maxChoices = 5;

export const ComponentCreator: React.FC<ComponentCreatorProps> = ({components, setComponents}) => {

  return (
    <View>
      {components.map((component, idx) => 
                    
                        <ComponentOption 
                          key={idx}
                          component={component}
                          idx={idx}
                          components={components}
                          setComponents={setComponents}
                        />)}
                    <View 
                        style={{
                            backgroundColor: Colors.lightGray,
                            // TODO: Maybe set animation here somewhere :thinking:
                            elevation: 2,
                            borderRadius: 10,
                            marginBottom: 20,
                            alignItems: 'center',
                            flexDirection: 'row',
                            justifyContent: 'space-around',
                            width: '100%'
                        }}>
                        <IconButton 
                            theme={{colors: {primary: Colors.primary}}}
                            style={{borderWidth: 1, borderColor: 'darkgrey', width: '48%', borderRadius: 10}}
                            
                            size={30}
                            disabled={components.length >= maxChoices }
                            onPress={() => setComponents([...components, {
                              type: 'Text',
                              text: ''
                            }])}
                            color='grey'
                            icon='comment-plus'/>
                        <IconButton 
                            theme={{colors: {primary: Colors.primary}}}
                            style={{borderWidth: 1, borderColor: 'darkgrey', width: '48%', borderRadius: 10}}
                            size={30}
                            disabled={components.length >= maxChoices }
                            onPress={() => setComponents([...components, {
                              type: 'Image',
                              imageReference: null
                            }])}
                            color='grey'
                            icon='image-plus'/>
                    </View>
    </View>
  )
}

interface ComponentOptionProps extends ComponentCreatorProps {
  component: PrototypeComponent,
  idx: number
}

const ComponentOption: React.FC<ComponentOptionProps> = ({ component, idx, components, setComponents }) => {
  switch (component.type) {

    case 'Text': 
      return (
        <View 
          style={{
              backgroundColor: Colors.lightGray,
              elevation: 2,
              padding: 5,
              borderRadius: 10,
              marginBottom: 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              alignContent: 'center',
              alignSelf: 'center'
          }}>
          <View style={{
            flexGrow: 1,
            alignSelf: 'center'
                }}>
            <TextInput 
                theme={{colors: {primary: Colors.primary}}}
                value={component.text}
                underlineColor="transparent"
                style={{
                    borderRadius: 5 // What in gods fucking name is this sorcery. I've no idea how to solve this
                }}
                placeholder='Enter text message...'
                onChangeText={(text) => {
                    setComponents(components.map((com, arIdx) => arIdx===idx ? {type: 'Text', text: text}: com))
                }}/>
          </View>

          <IconButton    
              theme={{colors: {primary: Colors.primary}}}
              style={{marginHorizontal: 15}}
              disabled={components.length <= 1}
              color='grey'
              onPress={() => setComponents(components.filter((_, idx_i) => idx_i !== idx))}
              icon='delete'/>
        </View>
        )

    case 'Image':
      return (<>
        <View style={{
          backgroundColor: Colors.lightGray,
          elevation: 2,
          padding: 5,
          borderRadius: 10,
          marginBottom: 10,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          alignContent: 'center',
          alignSelf: 'center'
          }}>
          <ImageReferencePicker 
            reference={component.imageReference}
            setReference={(reference) => {setComponents(components.map((com, arIdx) => arIdx === idx ? {
              type: 'Image',
              imageReference: reference
            } : com))}}
            style={{
              height: 200, 
              flexGrow: 1,
              }}/>
          <IconButton 
            theme={{colors: {primary: Colors.primary}}}
            style={{marginHorizontal: 15}}
            disabled={components.length <= 1}
            color='grey'
            onPress={() => setComponents(components.filter((_, idx_i) => idx_i !== idx))}
            icon='delete'
            />
        </View>
        </>
      )
  }
}