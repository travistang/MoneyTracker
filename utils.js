import React from 'react'
import {
  Picker
} from 'react-native-ui-lib'
import {
  TextInput,
  Button
} from 'react-native-paper'
import { colors } from './config'

export const mapArrayToObject = (arr, f) => {
  let res = {}
  for(let i in arr) {
    res[arr[i]] = f(arr[i])
  }
  return res
}

export const isEmptyString = s => {
  return !s
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

export const getPickerComponent =
  (
    component,
    label,
    fieldName,
    choices,
    formName = "form",
    config = {}
  ) => {
    // alert(JSON.stringify(config))
    return (
      <Picker
        hideUnderline
        value={component.state[formName][fieldName]}
        onChange={val => component.setState({
          [formName]: {
            ...component.state[formName],
            [fieldName]:val
          }
        })}
        containerStyle={{margin: 8}}
        style={{
          backgroundColor: colors.surface,
          color: colors.text
        }}
        useNativePicker
        {...config}
      >
        {
          choices.map(choice => (
            <Picker.Item key={choice} value={choice} label={choice} />
          ))
        }
      </Picker>
    )
  }

export const buildForm = (component, questions) => questions.map(
  question => {
  switch(question.type) {
    case "text":
      return getTextInputComponent(
        component,
        question.label,
        question.fieldName,
        question.formName,
        {
          mode: 'outlined',...question.config
        }
      )
    case "picker":
      return getPickerComponent(
        component,
        question.label,
        question.fieldName,
        question.choices,
        question.formName,
        question.config
      )
    case "number":
      return getTextInputComponent(
        component,
        question.label,
        question.fieldName,
        question.formName,
        {
          keyboardType: 'numeric',
          mode: 'outlined',
          ...question.config
        }
      )
    default:
      return null // not sure what this is..
  }
})
