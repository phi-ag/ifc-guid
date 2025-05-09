# @phi-ag/ifc-guid

[![Version](https://img.shields.io/npm/v/%40phi-ag%2Fifc-guid?style=for-the-badge&color=blue)](https://www.npmjs.com/package/@phi-ag/ifc-guid)
[![Coverage](https://img.shields.io/codecov/c/github/phi-ag/ifc-guid?style=for-the-badge)](https://app.codecov.io/github/phi-ag/ifc-guid)
[![Downloads](https://img.shields.io/npm/d18m/%40phi-ag%2Fifc-guid?style=for-the-badge)](https://www.npmjs.com/package/@phi-ag/ifc-guid)
[![Size](https://img.shields.io/npm/unpacked-size/%40phi-ag%2Fifc-guid?style=for-the-badge&label=size&color=lightgray)](https://www.npmjs.com/package/@phi-ag/ifc-guid)

Convert [IFC GUID](https://technical.buildingsmart.org/resources/ifcimplementationguidance/ifc-guid/)

## Usage

    pnpm add @phi-ag/ifc-guid

### Example

```ts
import { fromIfcGuid, toIfcGuid } from "@phi-ag/ifc-guid";

toIfcGuid("1f41ae2a-fae2-482c-99a9-11070ec1df8f");
// => 0VGQug_k98B9cf4GSEmT_F

fromIfcGuid("01bhO9fsz_RxNh9a_y9jls");
// => 0196b609-a76f-7e6f-b5eb-264fbc26dbf6
```
