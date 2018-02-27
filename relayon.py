import RPi.GPIO as GPIO
import time
import sys

GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)

GPIO.setup(4, GPIO.OUT) #First Appliance: 1
GPIO.setup(17, GPIO.OUT) #Second Appliance: 2
GPIO.setup(27, GPIO.OUT) #Third Appliance: 3
GPIO.setup(22, GPIO.OUT) #Fourth Appliance: 4


if __name__ == "__main__":

    def endProcess(signalnum=None, handler=None):
        sys.exit()
    
    
    if sys.argv[1] == '1':
        GPIO.output(4,True)
    elif sys.argv[1] == '2':
        GPIO.output(17,True)
    elif sys.argv[1] == '3':
        GPIO.output(27,True)
    elif sys.argv[1] == '4':
        GPIO.output(22,True)
    elif sys.argv[1] == '5':
        GPIO.output(4,True)
        GPIO.output(17,True)
        GPIO.output(27,True)
        GPIO.output(22,True)
    
