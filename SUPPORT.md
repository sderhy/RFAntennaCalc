# RFAntennaCalc - Support

## About RFAntennaCalc

RFAntennaCalc is an essential antenna calculation tool designed specifically for radio amateurs. Developed by **F4HYY**, this app provides quick and accurate antenna calculations for field operations, POTA/SOTA activations, and antenna tuning.

## Features

### 🔧 Antenna Adjuster
Adjust your dipole or end-fed antenna length based on actual resonance measurements from your VNA or antenna analyzer. Perfect for field adjustments during POTA activations or outdoor operations.

**How to use:**
1. Enter your target frequency
2. Enter the measured resonant frequency from your VNA
3. Enter your current antenna length
4. Enter the velocity factor (typically 0.95-0.98 for wire antennas)
5. The app calculates the new optimal length

### 📏 Dipole Calculator
Calculate the optimal dipole length for any HF frequency with velocity factor compensation.

**How to use:**
1. Enter your desired operating frequency
2. Enter the velocity factor for your wire
3. Get the total dipole length and length per leg in meters

## Frequently Asked Questions

### What is the velocity factor?
The velocity factor (VF) accounts for the fact that RF energy travels slightly slower in a wire than in free space. Common values:
- Bare copper wire: 0.95-0.97
- Insulated wire: 0.92-0.95
- Coaxial cable: 0.66-0.85

### Why are my results slightly different from other calculators?
Small variations are normal and depend on:
- Wire height above ground
- Surrounding objects
- Wire diameter
- End effects

Always fine-tune your antenna with a VNA or SWR meter for best results.

### Does the app require internet?
No! RFAntennaCalc works completely offline, perfect for field operations.

### Does the app collect any personal data?
No. RFAntennaCalc does not collect, store, or transmit any personal data. All calculations are performed locally on your device.

## Support & Contact

### Report a Bug
If you encounter any issues, please:
1. Open an issue on [GitHub](https://github.com/sderhy/RFAntennaCalc/issues)
2. Include:
   - Your device model and iOS version
   - Steps to reproduce the issue
   - Screenshots if applicable

### Feature Requests
Have an idea to improve RFAntennaCalc? 
- Open a feature request on [GitHub](https://github.com/sderhy/RFAntennaCalc/issues)
- Or contact me via QRZ.com: **F4HYY**

### Email Support
For general questions or support: sderhy@gmail.com

## Technical Information

### Formulas Used

**Dipole Length (meters):**
```
Length = (300 / Frequency_MHz) * Velocity_Factor / 2
```

**Antenna Adjustment:**
```
New_Length = Current_Length * (Target_Freq / Measured_Freq)
```

### Supported Frequencies
The app is optimized for HF bands (1.8 - 30 MHz) but can calculate for any frequency.

## Acknowledgments

Special thanks to the amateur radio community for their feedback and suggestions.

**73!**

---

Developed by **F4HYY**
Version 1.0
© 2025

[Privacy Policy](PRIVACY.md) | [GitHub Repository](https://github.com/sderhy/RFAntennaCalc)
