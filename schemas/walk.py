import pyautogui
import time

def hold_W (hold_time):
    pyautogui.keyDown('a')
    time.sleep(hold_time)
    pyautogui.keyUp('a')

hold_W(1)