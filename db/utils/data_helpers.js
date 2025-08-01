function extractComponentsInfo(spellData) {
	const spellsClone = structuredClone(spellData);
	const materials = [];
	const uniqueComponents = new Set();
	spellsClone.forEach((spell) => {
		if (spell.components.m && !uniqueComponents.has(spell.components.m)) {
			const materialEntry = {
				description: "",
				cost: null,
				consume: false,
			};
			if (typeof spell.components.m !== "string") {
				materialEntry.description = spell.components.m.text;
				if (spell.components.m.cost) {
					materialEntry.cost = spell.components.m.cost;
				}
				console.log(spell.components.m);
				if (spell.components.m.consume) {
					materialEntry.consume = spell.components.m.consume;
				}
				uniqueComponents.add(spell.components.m.text);
			} else {
				materialEntry.description = spell.components.m;
				uniqueComponents.add(spell.components.m);
			}
			materials.push(materialEntry);
		}
	});
	return { materials };
}

module.exports = { extractComponentsInfo };
