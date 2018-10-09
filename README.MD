# Multiprocessor CPU emulator

## CPU Architecture

This is CISC architecture. Uses 1 cell for instruction code, but it can be extended and added.

Processor have 16 common registers. Executing instruction is multi-tick operation.

## Memory controller

Controller can be connected to any devices with `IMemoryDevice` interface.
It is deviding access to memory device between all devices.

## Memory

Memory is simple device, wich get or set data by presented address.
