import fc from "fast-check";
import { describe, expect, test } from "vitest";

import { fromIfcGuid, toIfcGuid, toIfcGuidArray } from "./index.js";

describe("ifc guid", () => {
  /*
   * This is the example `01cf62c8-e9bc-bf88-0000-000000000005` used in other projects,
   * eg. https://github.com/serversidebim/ifcguid/blob/master/tests/IFCGuidTest.php
   * Passing it as array since it isn't a valid UUID (invalid version).
   */
  test("example uuid", () => {
    const guid = new Uint8Array([
      1, 207, 98, 200, 233, 188, 191, 136, 0, 0, 0, 0, 0, 0, 0, 5
    ]);

    const expected = "01psB8wRo$Y00000000005";
    expect(toIfcGuidArray(guid)).toEqual(expected);
  });

  /*
   * Generated using the reference implementation,
   * see https://github.com/IfcOpenShell/IfcOpenShell/blob/master/src/ifcopenshell-python/ifcopenshell/guid.py
   * ```py
   * print(compress(uuid.UUID("1f41ae2a-fae2-482c-99a9-11070ec1df8f").hex))
   * ```
   */
  test("example uuid v4", () => {
    const ifc = "0VGQug_k98B9cf4GSEmT_F";
    const guid = "1f41ae2a-fae2-482c-99a9-11070ec1df8f";
    expect(toIfcGuid(guid)).toEqual(ifc);
  });

  test("example uuid v7", () => {
    const ifc = "01bhO9fsz_RxNh9a_y9jls";
    const guid = "0196b609-a76f-7e6f-b5eb-264fbc26dbf6";
    expect(toIfcGuid(guid)).toEqual(ifc);
  });

  test("invalid length", () => {
    const tooLong = "01bhO9fsz_RxNh9a_y9jls_";
    expect(() => fromIfcGuid(tooLong)).toThrowError("Invalid IFC-GUID length (23)");

    const tooShort = "01bhO9fsz_RxNh9a_y9jl";
    expect(() => fromIfcGuid(tooShort)).toThrowError("Invalid IFC-GUID length (21)");

    // @ts-expect-error
    expect(() => fromIfcGuid(null)).toThrowError("Invalid IFC-GUID length (undefined)");
  });

  test("invalid characters", () => {
    const ifc = "01bhO9fsz_RxNh9a_y9jl=";
    expect(() => fromIfcGuid(ifc)).toThrowError("Invalid character in IFC-GUID");
  });

  test("invalid uuid length", () => {
    const tooShort = new Uint8Array([
      1, 207, 98, 200, 233, 188, 191, 136, 0, 0, 0, 0, 0, 0, 0
    ]);
    expect(() => toIfcGuidArray(tooShort)).toThrowError("Invalid UUID length (15)");
    // @ts-expect-error
    expect(() => toIfcGuidArray(null)).toThrowError("Invalid UUID length (undefined)");
  });

  test("fast check", () => {
    fc.assert(
      fc.property(fc.uuid(), (guid) => {
        const ifcGuid = toIfcGuid(guid);
        expect(fromIfcGuid(ifcGuid)).toEqual(guid);
      }),
      { numRuns: 1_000 }
    );
  });
});
