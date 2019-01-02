import React from 'react'
import {
  Button
} from 'react-native-paper'
import * as Config from '../config'
export default CardHeader = (props) => (
  <Button
    icon={props.icon} dsiabled color={Config.colors.text}
    style={{...props.style,
      minWidth: 132
    }}>
    {props.text}
  </Button>
)
