const { extractComponentsInfo } = require("../db/utils/data_helpers");
const testData = require("../db/data/dev/spells.json");

describe("extractComponentsInfo", () => {
	test("returns an object with an array of materials", () => {
		const result = extractComponentsInfo([]);
		expect(Object.keys(result)).toEqual(["materials"]);
		expect(Array.isArray(result.materials)).toBe(true);
	});
	test("for one spell with material component featuring nested text and cost extracts values into object with description, consume, and cost properties", () => {
		const result = extractComponentsInfo([
			{
				name: "Augury",
				source: "XPHB",
				page: 244,
				srd52: true,
				basicRules2024: true,
				level: 2,
				school: "D",
				time: [
					{
						number: 1,
						unit: "minute",
					},
				],
				range: {
					type: "point",
					distance: {
						type: "self",
					},
				},
				components: {
					v: true,
					s: true,
					m: {
						text: "specially marked sticks, bones, cards, or other divinatory tokens worth 25+ GP",
						cost: 2500,
					},
				},
				duration: [
					{
						type: "instant",
					},
				],
				meta: {
					ritual: true,
				},
				entries: [
					"You receive an omen from an otherworldly entity about the results of a course of action that you plan to take within the next 30 minutes. The DM chooses the omen from the Omens table.",
					{
						type: "table",
						caption: "Omens",
						colStyles: ["col-4", "col-8"],
						colLabels: ["Omen", "For Results That Will Be..."],
						rows: [
							["Weal", "Good"],
							["Woe", "Bad"],
							["Weal and woe", "Good and bad"],
							["Indifference", "Neither good nor bad"],
						],
					},
					"The spell doesn't account for circumstances, such as other spells, that might change the results.",
					"If you cast the spell more than once before finishing a {@variantrule Long Rest|XPHB}, there is a cumulative {@chance 25|||Random reading!|Regular reading} chance for each casting after the first that you get no answer.",
				],
			},
		]);
		expect(result.materials[0]).toEqual({
			description:
				"specially marked sticks, bones, cards, or other divinatory tokens worth 25+ GP",
			cost: 2500,
			consume: false,
		});
	});
	test("for one spell with material component featuring only text description, extracts values into object with description, and default values for cost and consume", () => {
		const result = extractComponentsInfo([
			{
				name: "Aid",
				source: "XPHB",
				page: 239,
				srd52: true,
				basicRules2024: true,
				level: 2,
				school: "A",
				time: [
					{
						number: 1,
						unit: "action",
					},
				],
				range: {
					type: "point",
					distance: {
						type: "feet",
						amount: 30,
					},
				},
				components: {
					v: true,
					s: true,
					m: "a strip of white cloth",
				},
				duration: [
					{
						type: "timed",
						duration: {
							type: "hour",
							amount: 8,
						},
					},
				],
				entries: [
					"Choose up to three creatures within range. Each target's {@variantrule Hit Points|XPHB|Hit Point} maximum and current {@variantrule Hit Points|XPHB} increase by 5 for the duration.",
				],
				entriesHigherLevel: [
					{
						type: "entries",
						name: "Using a Higher-Level Spell Slot",
						entries: [
							"Each target's {@variantrule Hit Points|XPHB} increase by 5 for each spell slot level above 2.",
						],
					},
				],
				miscTags: ["HL"],
				areaTags: ["MT"],
			},
		]);
		expect(result.materials[0]).toEqual({
			description: "a strip of white cloth",
			cost: null,
			consume: false,
		});
	});
	test("for one spell with no material components, list of materials is empty", () => {
		const result = extractComponentsInfo([
			{
				name: "Antilife Shell",
				source: "XPHB",
				page: 241,
				srd52: true,
				basicRules2024: true,
				level: 5,
				school: "A",
				time: [
					{
						number: 1,
						unit: "action",
					},
				],
				range: {
					type: "emanation",
					distance: {
						type: "feet",
						amount: 10,
					},
				},
				components: {
					v: true,
					s: true,
				},
				duration: [
					{
						type: "timed",
						duration: {
							type: "hour",
							amount: 1,
						},
						concentration: true,
					},
				],
				entries: [
					"An aura extends from you in a 10-foot Emanation for the duration. The aura prevents creatures other than Constructs and Undead from passing or reaching through it. An affected creature can cast spells or make attacks with Ranged or Reach weapons through the barrier.",
					"If you move so that an affected creature is forced to pass through the barrier, the spell ends.",
				],
				affectsCreatureType: [
					"aberration",
					"beast",
					"celestial",
					"dragon",
					"elemental",
					"fey",
					"fiend",
					"giant",
					"humanoid",
					"monstrosity",
					"ooze",
					"plant",
				],
				areaTags: ["S"],
			},
		]);
		expect(Array.isArray(result.materials)).toBe(true);
		expect(result.materials.length).toBe(0);
	});
	test("returns a new array of new objects", () => {
		const resultObject = extractComponentsInfo(testData);
		expect(testData).not.toBe(resultObject.materials);
		resultObject.materials.forEach((component) => {
			testData.forEach((spell) => {
				expect(component).not.toBe(spell);
			});
		});
	});
	test("does not mutate original input", () => {
		const inputCopy = [...testData];
		const result = extractComponentsInfo(testData);
		expect(inputCopy).toEqual(testData);
	});
});
