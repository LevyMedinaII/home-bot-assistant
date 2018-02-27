# =========================================================
# Seeed Studio Raspberry Pi Relay Board Library
#
# by John M. Wargo (www.johnwargo.com)
#
# Modified from the sample code on the Seeed Studio Wiki
# http://wiki.seeed.cc/Raspberry_Pi_Relay_Board_v1.0/
# =========================================================


import sys
import RPi.GPIO as GPIO

GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)


if __name__ == "__main__":
    def endProcess(signalnum=None, handler=None):
        sys.exit()
    

    if sys.argv[1] == '1':
        print(GPIO.input(4))
    elif sys.argv[1] == '2':
        print(GPIO.input(17))
    elif sys.argv[1] == '3':
        print(GPIO.input(27))
    elif sys.argv[1] == '4':
        print(GPIO.input(22))
    elif sys.argv[1] == '5':
        print(GPIO.input(4))
        print(GPIO.input(17))
        print(GPIO.input(27))
        print(GPIO.input(22))

    
    