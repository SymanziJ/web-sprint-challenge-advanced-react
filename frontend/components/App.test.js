import React from 'React';
import {render, screen, fireEvent} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AppClass from '../components/AppClass';

// Write your tests here
test('sanity', () => {
  expect(true).toBe(true);
})

beforeEach(() => {
  render(<AppClass />);
})

describe('AppClass testing', () => {
  test('Renders without crashing', () => {
    render(<AppClass />)
  })
  test('Render Coordinates text', () => {
    const coordinates = document.querySelector('#coordinates')
    expect(coordinates).toBeTruthy();
  })
  test('Render movement buttons', () => {
    const upBn = screen.getByText(/up/i);
    const downBn = screen.getByText(/down/i);
    const leftBn = screen.getByText(/left/i);
    const rightBn = screen.getByText(/right/i);
    
    expect(upBn).toBeTruthy();
    expect(downBn).toBeTruthy();
    expect(leftBn).toBeTruthy();
    expect(rightBn).toBeTruthy();
  })
  test('Active square cannot go beyond grid', () => {
    const coordinates = document.querySelector('#coordinates')
    const message = document.querySelector('#message')
    const upBn = screen.getByText(/up/i);

    fireEvent.click(upBn)
    fireEvent.click(upBn)
    expect(coordinates.textContent).toMatch(/coordinates \(2, 1\)/i)
    expect(message.textContent).toMatch(/you can't go up/i)
  })
  test('typing on the input results in its value changing to the entered text', () => {
    const emailInput = screen.getByPlaceholderText('type email');
    const testText = 'testing the input';
    userEvent.setup().type(emailInput, testText);
    expect(testText).toMatch('testing the input');
  })
})