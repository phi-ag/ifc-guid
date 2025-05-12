import fc from "fast-check";
import { MAX as MAX_UUID, NIL as NIL_UUID } from "uuid";
import { describe, expect, test } from "vitest";

import {
  fromIfcGuid,
  fromIfcGuidArray,
  toIfcGuid,
  toIfcGuidArray,
  validate
} from "./index.js";

describe("ifc guid", () => {
  /*
   * This is the example `01cf62c8-e9bc-bf88-0000-000000000005` used in other projects,
   * eg. https://github.com/serversidebim/ifcguid/blob/master/tests/IFCGuidTest.php
   * Passing it as array since it isn't a valid UUID (invalid version).
   */
  test("example uuid", () => {
    const ifc = "01psB8wRo$Y00000000005";
    const uuid = new Uint8Array([
      1, 207, 98, 200, 233, 188, 191, 136, 0, 0, 0, 0, 0, 0, 0, 5
    ]);

    expect(toIfcGuidArray(uuid)).toEqual(ifc);
    expect(fromIfcGuidArray(ifc)).toEqual(uuid);
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
    const uuid = "1f41ae2a-fae2-482c-99a9-11070ec1df8f";
    expect(toIfcGuid(uuid)).toEqual(ifc);
    expect(fromIfcGuid(ifc)).toEqual(uuid);
  });

  test("example uuid v7", () => {
    const ifc = "01bhO9fsz_RxNh9a_y9jls";
    const uuid = "0196b609-a76f-7e6f-b5eb-264fbc26dbf6";
    expect(toIfcGuid(uuid)).toEqual(ifc);
    expect(fromIfcGuid(ifc)).toEqual(uuid);
  });

  test("uuid limits", () => {
    const nil = "0000000000000000000000";
    expect(toIfcGuid(NIL_UUID)).toEqual(nil);
    expect(fromIfcGuid(nil)).toEqual(NIL_UUID);

    const max = "3$$$$$$$$$$$$$$$$$$$$$";
    expect(toIfcGuid(MAX_UUID)).toEqual(max);
    expect(fromIfcGuid(max)).toEqual(MAX_UUID);
  });

  test("validate", () => {
    const ifc = "0VGQug_k98B9cf4GSEmT_F";
    expect(validate(ifc)).toBeTruthy();

    const tooLong = "01bhO9fsz_RxNh9a_y9jls_";
    expect(validate(tooLong)).toBeFalsy();

    const tooShort = "01bhO9fsz_RxNh9a_y9jl";
    expect(validate(tooShort)).toBeFalsy();

    const invalidFirstCharacter = "41bhO9fsz_RxNh9a_y9jls";
    expect(validate(invalidFirstCharacter)).toBeFalsy();

    // @ts-expect-error
    expect(validate([1, 2, 3])).toBeFalsy();

    // @ts-expect-error
    expect(validate(null)).toBeFalsy();
  });

  test("invalid type", () => {
    // @ts-expect-error
    expect(() => fromIfcGuid([1, 2, 3])).toThrowError("Invalid IFC-GUID type");
    // @ts-expect-error
    expect(() => fromIfcGuid(123)).toThrowError("Invalid IFC-GUID type");
    // @ts-expect-error
    expect(() => fromIfcGuid(null)).toThrowError("Invalid IFC-GUID type");
  });

  test("invalid length", () => {
    const tooLong = "01bhO9fsz_RxNh9a_y9jls_";
    expect(() => fromIfcGuid(tooLong)).toThrowError("Invalid IFC-GUID length (23)");

    const tooShort = "01bhO9fsz_RxNh9a_y9jl";
    expect(() => fromIfcGuid(tooShort)).toThrowError("Invalid IFC-GUID length (21)");
  });

  test("invalid character", () => {
    const containsEquals = "01bhO9fsz_RxNh9a_y9jl=";
    expect(() => fromIfcGuid(containsEquals)).toThrowError(
      "Invalid character in IFC-GUID"
    );

    const invalidFirstCharacter = "41bhO9fsz_RxNh9a_y9jls";
    expect(() => fromIfcGuid(invalidFirstCharacter)).toThrowError(
      "Invalid character in IFC-GUID"
    );
  });

  test("invalid uuid length", () => {
    const tooShort = new Uint8Array([
      1, 207, 98, 200, 233, 188, 191, 136, 0, 0, 0, 0, 0, 0, 0
    ]);
    expect(() => toIfcGuidArray(tooShort)).toThrowError("Invalid UUID length (15)");
  });

  test("invalid uuid type", () => {
    // @ts-expect-error
    expect(() => toIfcGuidArray([1, 2, 3])).toThrowError("Invalid UUID type");
    // @ts-expect-error
    expect(() => toIfcGuidArray("")).toThrowError("Invalid UUID type");
    // @ts-expect-error
    expect(() => toIfcGuidArray(null)).toThrowError("Invalid UUID type");
  });

  test("fast check", () => {
    fc.assert(
      fc.property(fc.uuid(), (uuid) => {
        expect(fromIfcGuid(toIfcGuid(uuid))).toEqual(uuid);
      }),
      { numRuns: 1_000 }
    );
  });
});
