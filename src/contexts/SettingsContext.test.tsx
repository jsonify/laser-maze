import React, { useContext } from 'react';
import { render } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { SettingsContextProvider, SettingsContext } from './SettingsContext';

describe('SettingsContext', () => {
  it('should render children', () => {
    const { container } = render(
      <SettingsContextProvider>
        <div>Test Children</div>
      </SettingsContextProvider>
    );
    expect(container.firstChild).toBeInstanceOf(HTMLElement);
    expect(container.textContent).toBe('Test Children');
  });

  it('should provide initial settings', () => {
    const { result } = renderHook(() => useContext(SettingsContext), {
      wrapper: SettingsContextProvider,
    });
    expect(result.current?.settings).toEqual({ theme: 'light', sound: true });
  });

  it('should provide updateSetting function', () => {
    const { result } = renderHook(() => useContext(SettingsContext), {
      wrapper: SettingsContextProvider,
    });
    expect(result.current?.updateSetting).toBeInstanceOf(Function);
  });
});
