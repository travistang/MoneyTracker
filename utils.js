import React from 'react'
import {
  TextInput
} from 'react-native-paper'

export const mapArrayToObject = (arr, f) => {
  let res = {}
  for(let i in arr) {
    res[arr[i]] = f(arr[i])
  }
  return res
}

// helper function to reduce repetition in creating form components
export const getTextInputComponent =
  (
   component,
   label,
   fieldName,
   formName = "form",
   config = {}
  ) => {
    return (
    <TextInput label={label}
      value={component.state[formName][fieldName]}
      onChangeText={val => component.setState({
        [formName]: {...component.state[formName],
          [fieldName]: val
        }
      })}
      style={{margin: 8}}
      {...config}
    />
   )
 }
