import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import NeomorphButton from '../../components/NeomorphButton';
import { ThemeProvider } from '../../hooks/useTheme';

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

describe('NeomorphButton', () => {
  it('рендерит кнопку с заголовком', () => {
    const { getByText } = render(
      <TestWrapper>
        <NeomorphButton title="Тест кнопка" onPress={jest.fn()} />
      </TestWrapper>
    );

    expect(getByText('Тест кнопка')).toBeTruthy();
  });

  it('вызывает onPress при нажатии', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <TestWrapper>
        <NeomorphButton title="Тест кнопка" onPress={onPressMock} />
      </TestWrapper>
    );

    fireEvent.press(getByText('Тест кнопка'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('отключается при disabled=true', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <TestWrapper>
        <NeomorphButton 
          title="Тест кнопка" 
          onPress={onPressMock} 
          disabled={true} 
        />
      </TestWrapper>
    );

    fireEvent.press(getByText('Тест кнопка'));
    expect(onPressMock).not.toHaveBeenCalled();
  });

  it('показывает состояние загрузки', () => {
    const { getByText } = render(
      <TestWrapper>
        <NeomorphButton 
          title="Тест кнопка" 
          onPress={jest.fn()} 
          loading={true} 
        />
      </TestWrapper>
    );

    expect(getByText('Загрузка...')).toBeTruthy();
  });

  it('применяет разные варианты стилей', () => {
    const { rerender, getByTestId } = render(
      <TestWrapper>
        <NeomorphButton 
          title="Primary" 
          onPress={jest.fn()} 
          variant="primary"
          testID="button"
        />
      </TestWrapper>
    );

    const button = getByTestId('button');
    expect(button).toBeTruthy();

    rerender(
      <TestWrapper>
        <NeomorphButton 
          title="Success" 
          onPress={jest.fn()} 
          variant="success"
          testID="button"
        />
      </TestWrapper>
    );

    expect(getByTestId('button')).toBeTruthy();
  });
});