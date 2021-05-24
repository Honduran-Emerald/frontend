import React, { useState } from 'react';
import { Dimensions, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Svg, { Path } from 'react-native-svg';

export const SvgDemo: React.FC = () => {

    const [x, setX] = useState(100);

    return (
        <View>
            <View>
                <Svg height='300' width={Dimensions.get('screen').width}>
                    <Path 
                        d={`M ${Dimensions.get('screen').width/2} 0 C ${Dimensions.get('screen').width/2} 100 ${x} 200 ${x} 300`}
                        stroke='black'
                        strokeWidth='1'
                    />
                </Svg>
            </View>
            <View>
                <ScrollView horizontal
                    onScroll={(event) => {setX(Dimensions.get('screen').width -100 - event.nativeEvent.contentOffset.x)}}>
                    {[0,1,2,3,4,5,6,7,8,9,10].map(i => <Text style={{backgroundColor: 'rgba(150,150,0,0.5)', padding: 5, margin: 15}} key={i}>{i}</Text>)}
                </ScrollView>
            </View>
            <View>
                <Text>
                    {JSON.stringify(x)}
                </Text>
            </View>
            
        </View>
    )
}