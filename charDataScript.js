const fs = require('fs');

// Path to the JSON file
const filePathCN = '../ArknightsGameData/zh_CN/gamedata/excel/character_table.json';
const filePathEN = './en_US/gamedata/excel/character_table.json';
const filePathJP = './ja_JP/gamedata/excel/character_table.json';
const filePathKo = './ko_KR/gamedata/excel/character_table.json';
const profileInfoPath = '../ArknightsGameData/zh_CN/gamedata/excel/handbook_info_table.json';
const gameDataFilePath = '../endOfTheLine/end-of-the-line-frontend/src/pages/arknights/pages/operators/components/data/charData.json';

const skillFilePathCN = '../ArknightsGameData/zh_CN/gamedata/excel/skill_table.json';
const skillFilePathEN = './en_US/gamedata/excel/skill_table.json';
const skillFilePathJP = './ja_JP/gamedata/excel/skill_table.json';
const skillFilePathKo = './ko_KR/gamedata/excel/skill_table.json';

// Read and parse the JSON file
const characterDataCN = JSON.parse(fs.readFileSync(filePathCN, 'utf8'));
const characterDataEN = JSON.parse(fs.readFileSync(filePathEN, 'utf8'));
const characterDataJP = JSON.parse(fs.readFileSync(filePathJP, 'utf8'));
const characterDataKo = JSON.parse(fs.readFileSync(filePathKo, 'utf8'));
const skillDataCN = JSON.parse(fs.readFileSync(skillFilePathCN, 'utf8'));
const skillDataEN = JSON.parse(fs.readFileSync(skillFilePathEN, 'utf8'));
const skillDataJP = JSON.parse(fs.readFileSync(skillFilePathJP, 'utf8'));
const skillDataKo = JSON.parse(fs.readFileSync(skillFilePathKo, 'utf8'));

const profileData = JSON.parse(fs.readFileSync(profileInfoPath, 'utf8'));
const gameData = JSON.parse(fs.readFileSync(gameDataFilePath, 'utf8'));

let updatedGameData = [...gameData]; 

// Extract character details
Object.keys(characterDataCN).forEach(key => {
    let charCN = characterDataCN[key];
    let charEN = characterDataEN[key] || {};
    let charJP = characterDataJP[key] || {};
    let charKo = characterDataKo[key] || {};
    let gender = getGender(key);

    if (!(key.startsWith("trap") || key.startsWith("token") || charCN.isNotObtainable === true || charCN.subProfessionId.startsWith("notchar"))) {
        const existingCharacterIndex = updatedGameData.findIndex(item => item.id === key);
        const characterDetails = {
            id: key,
            name: {
                zh: charCN.name,
                en: charEN.name || '',
                ja: charJP.name || '',
                ko: charKo.name || '',
            },
            gender: {
                zh: gender,
                en: getGenderEN(gender),
                ja: getGenderJP(gender),
                ko: getGenderKo(gender),
            },
            tagline: {
                zh: charCN.itemUsage ? `${charCN.itemUsage} ${charCN.itemDesc}` : '',
                en: charEN.itemUsage ? `${charEN.itemUsage} ${charEN.itemDesc}` : '',
                ja: charJP.itemUsage ? `${charJP.itemUsage} ${charJP.itemDesc}` : '',
                ko: charKo.itemUsage ? `${charKo.itemUsage} ${charKo.itemDesc}` : '',
            },
            rarity: charCN.rarity[5],
            class: {
                zh: getClass(charCN, "zh"),
                en: getClass(charCN, "en"),
                ja: getClass(charCN, "ja"),
                ko: getClass(charCN, "ko"),
            },
            subclass: {
                zh: getSubClass(charCN, "zh"),
                en: getSubClass(charCN, "en"),
                ja: getSubClass(charCN, "ja"),
                ko: getSubClass(charCN, "ko"),
            },
            tagList: {
                zh: charCN.tagList || [],
                en: charEN.tagList || [],
                ja: charJP.tagList || [],
                ko: charKo.tagList || [],
            },
            phases: {
                e0: {
                    rangeId: charCN.phases[0]?.rangeId || [],
                    maxLevel: charCN.phases[0]?.maxLevel || 'none',
                    lvlDataMin: charCN.phases[0]?.attributesKeyFrames?.data || 'none',
                    lvlDataMax: charCN.phases[0]?.attributesKeyFrames?.data || 'none',
                    evolveCost: charCN.phases[0]?.evolveCost || 'none',
                },
                e1: charCN.phases[1] ? {
                    rangeId: charCN.phases[1].rangeId || 'none',
                    maxLevel: charCN.phases[1].maxLevel || 'none',
                    lvlDataMin: charCN.phases[1].attributesKeyFrames?.data || 'none',
                    lvlDataMax: charCN.phases[1].attributesKeyFrames?.data || 'none',
                    evolveCost: charCN.phases[1].evolveCost || 'none',
                } : 'none',
                e2: charCN.phases[2] ? {
                    rangeId: charCN.phases[2].rangeId || 'none',
                    maxLevel: charCN.phases[2].maxLevel || 'none',
                    lvlDataMin: charCN.phases[2].attributesKeyFrames?.data || 'none',
                    lvlDataMax: charCN.phases[2].attributesKeyFrames?.data || 'none',
                    evolveCost: charCN.phases[2].evolveCost || 'none',
                } : 'none',
            },
            skillsid:{ 
                skill1: {
                    skillbase: charCN.skills[0] || 'none',
                    skillData: skillDataEN[charCN.skills[0] ? charCN.skills[0].skillId : 'none']
                },
                skill2: {
                    skillbase: charCN.skills[1] || 'none',
                    skillData: skillDataEN[charCN.skills[1] ? charCN.skills[1].skillId : 'none']
                },
                skill3: {
                    skillbase: charCN.skills[2] || 'none',
                    skillData: skillDataEN[charCN.skills[2] ? charCN.skills[2].skillId : 'none']
                },
                skill1Lvlup7: charCN.allSkillLvlup || 'none',
            },
            talents: {
                zh: charCN.talents,
                en: charEN.talents || [],
                ja: charJP.talents || [],
                ko: charKo.talents || [],
            },
            potential: {
                zh: charCN.potentialRanks,
                en: charEN.potentialRanks || [],
                ja: charJP.potentialRanks || [],
                ko: charKo.potentialRanks || [],
            },
            trait: {
                zh: charCN.description,
                en: charEN.description || '',
                ja: charJP.description || '',
                ko: charKo.description || '',
            },
        };

        if (existingCharacterIndex !== -1) {
            // Update existing character with any new EN data
            updatedGameData[existingCharacterIndex] = {...updatedGameData[existingCharacterIndex], ...characterDetails};
        } else {
            // Add new character
            updatedGameData.push(characterDetails);
        }
    }
});


function getClass(chara, lang){
    switch(chara.profession){
        case ("WARRIOR"): return lang === "zh" ? "近卫" : lang === "ja" ? "近衛" : lang === "ko" ? "전사" : "Guard";
        case ("MEDIC"): return lang === "zh" ? "医疗" : lang === "ja" ? "医療" : lang === "ko" ? "의료" : "Medic";
        case ("PIONEER"): return lang === "zh" ? "先锋" : lang === "ja" ? "先鋒" : lang === "ko" ? "전범" : "Vanguard";
        case ("CASTER"): return lang === "zh" ? "术师" : lang === "ja" ? "術師" : lang === "ko" ? "마비" : "Caster";
        case ("SNIPER"): return lang === "zh" ? "狙击" : lang === "ja" ? "狙撃" : lang === "ko" ? "사격수" : "Sniper";
        case ("TANK"): return lang === "zh" ? "重装" : lang === "ja" ? "重装" : lang === "ko" ? "중장" : "Defender";
        case ("SUPPORT"): return lang === "zh" ? "辅助" : lang === "ja" ? "輔助" : lang === "ko" ? "보조" : "Supporter";
        case ("SPECIAL"): return lang === "zh" ? "特种" : lang === "ja" ? "特殊" : lang === "ko" ? "특수" : "Specialist";
        default : return "";
    }
}

function getSubClass(chara, lang){
    switch(chara.subProfessionId){
        //Medics 6 total
        case ("physician"): return lang === "zh" ? "单体" : lang === "ja" ? "単体" : lang === "ko" ? "단일" : "Single-target";
        case ("ringhealer"): return lang === "zh" ? "群体" : lang === "ja" ? "群體" : lang === "ko" ? "그룹" : "Multi-target";
        case ("healer"): return lang === "zh" ? "治疗" : lang === "ja" ? "治療" : lang === "ko" ? "치료" : "Therapist";
        case ("wandermedic"): return lang === "zh" ? "游荡" : lang === "ja" ? "遊蕩" : lang === "ko" ? "떠돌이" : "Wandering Medic";
        case ("incantationmedic"): return lang === "zh" ? "咒术" : lang === "ja" ? "呪術" : lang === "ko" ? "주술" : "Incantation Medic";
        case ("chainhealer"): return lang === "zh" ? "链术" : lang === "ja" ? "連術" : lang === "ko" ? "연술" : "Chain Healer";

        //Guards 11 total
        case ("fearless"): return lang === "zh" ? "无畏" : lang === "ja" ? "無畏" : lang === "ko" ? "무벽" : "Dreadnought";
        case ("centurion"): return lang === "zh" ? "百夫长" : lang === "ja" ? "百夫長" : lang === "ko" ? "백부장" : "Centurion";
        case ("instructor"): return lang === "zh" ? "教官" : lang === "ja" ? "教官" : lang === "ko" ? "교관" : "Instructor";
        case ("lord"): return lang === "zh" ? "领主" : lang === "ja" ? "領主" : lang === "ko" ? "영주" : "Lord";
        case ("artsfghter"): return lang === "zh" ? "艺术战士" : lang === "ja" ? "藝術戦士" : lang === "ko" ? "예술전사" : "Arts Fighter";
        case ("sword"): return lang === "zh" ? "剑术大师" : lang === "ja" ? "剣術師" : lang === "ko" ? "검술사" : "Swordmaster";
        case ("musha"): return lang === "zh" ? "武士" : lang === "ja" ? "武士" : lang === "ko" ? "무사" : "Musha";
        case ("crusher"): return lang === "zh" ? "粉碎者" : lang === "ja" ? "粉碎者" : lang === "ko" ? "분쇄자" : "Crusher";
        case ("reaper"): return lang === "zh" ? "收割者" : lang === "ja" ? "收割者" : lang === "ko" ? "수확자" : "Reaper";
        case ("fighter"): return lang === "zh" ? "战士" : lang === "ja" ? "戦士" : lang === "ko" ? "전사" : "Fighter";
        case ("librator"): return lang === "zh" ? "解放者" : lang === "ja" ? "解放者" : lang === "ko" ? "해방자" : "Liberator";

        //Specialist 8 total 
        case ("executor"): return lang === "zh" ? "执行者" : lang === "ja" ? "執行者" : lang === "ko" ? "실행자" : "Executor";
        case ("merchant"): return lang === "zh" ? "商人" : lang === "ja" ? "商人" : lang === "ko" ? "상인" : "Merchant";
        case ("hookmaster"): return lang === "zh" ? "钩索大师" : lang === "ja" ? "フックマスター" : lang === "ko" ? "훅마스터" : "Hookmaster";
        case ("stalker"): return lang === "zh" ? "伏击者" : lang === "ja" ? "伏擊者" : lang === "ko" ? "스토크러" : "Ambusher";
        case ("pusher"): return lang === "zh" ? "推击者" : lang === "ja" ? "推擊者" : lang === "ko" ? "버스터" : "Push Stroker";
        case ("geek"): return lang === "zh" ? "极客" : lang === "ja" ? "極客" : lang === "ko" ? "극과" : "Geek";
        case ("traper"): return lang === "zh" ? "陷阱大师" : lang === "ja" ? "トラッパー" : lang === "ko" ? "트랩마스터" : "Trapmaster";
        case ("dollkeeper"): return lang === "zh" ? "玩偶大师" : lang === "ja" ? "人形師" : lang === "ko" ? "인형사" : "DollKeeper";

        //Sniper 7 total
        case ("fastshot"): return lang === "zh" ? "神射手" : lang === "ja" ? "神射手" : lang === "ko" ? "신수사" : "Marksman";
        case ("bombarder"): return lang === "zh" ? "炮击者" : lang === "ja" ? "砲擊者" : lang === "ko" ? "포격자" : "Flinger";
        case ("closerange"): return lang === "zh" ? "重击者" : lang === "ja" ? "重擊者" : lang === "ko" ? "중격자" : "Heavyshooter";
        case ("longrange"): return lang === "zh" ? "狙击者" : lang === "ja" ? "狙擊者" : lang === "ko" ? "사격수" : "Deadeye";
        case ("aoesniper"): return lang === "zh" ? "范围狙击者" : lang === "ja" ? "範囲狙擊者" : lang === "ko" ? "범위사격수" : "Artilleryman";
        case ("siegesniper"): return lang === "zh" ? "围攻狙击者" : lang === "ja" ? "包囲狙擊者" : lang === "ko" ? "포위사격수" : "Besieger";
        case ("reaperrange"): return lang === "zh" ? "散射狙击者" : lang === "ja" ? "散射狙擊者" : lang === "ko" ? "산사격수" : "Spreadshooter";
        case ("hunter"): return lang === "zh" ? "猎人" : lang === "ja" ? "獵人" : lang === "ko" ? "사냥꾼" : "Hunter";
        case ("loopshooter"): return lang === "zh" ? "环射狙击者" : lang === "ja" ? "環射狙擊者" : lang === "ko" ? "환사격수" : "Loopshooter";

        //Defender 7 total
        case ("protector"): return lang === "zh" ? "保护者" : lang === "ja" ? "保護者" : lang === "ko" ? "보호자" : "Protector";
        case ("guardian"): return lang === "zh" ? "守护者" : lang === "ja" ? "守護者" : lang === "ko" ? "수호자" : "Guardian";
        case ("unyield"): return lang === "zh" ? "不屈者" : lang === "ja" ? "不屈者" : lang === "ko" ? "불굴자" : "Juggernuat";
        case ("duelist"): return lang === "zh" ? "决斗者" : lang === "ja" ? "決鬥者" : lang === "ko" ? "결투자" : "Duelist";
        case ("fortress"): return lang === "zh" ? "堡垒" : lang === "ja" ? "堡壘" : lang === "ko" ? "성벽" : "Fortress";
        case ("artsprotector"): return lang === "zh" ? "艺术保护者" : lang === "ja" ? "藝術保護者" : lang === "ko" ? "예술보호자" : "Arts Proterctor";
        case ("shotprotector"): return lang === "zh" ? "哨卫保护者" : lang === "ja" ? "哨衛保護者" : lang === "ko" ? "경비보호자" : "Sentinel Protector";

        //Vanguard 5 total
        case ("pioneer"): return lang === "zh" ? "先锋" : lang === "ja" ? "先鋒" : lang === "ko" ? "전범" : "Pioneer";
        case ("charger"): return lang === "zh" ? "冲锋者" : lang === "ja" ? "衝鋒者" : lang === "ko" ? "돌격자" : "Charger";
        case ("tactician"): return lang === "zh" ? "战术家" : lang === "ja" ? "戦術家" : lang === "ko" ? "전술가" : "Tactician";
        case ("bearer"): return lang === "zh" ? "标准旗手" : lang === "ja" ? "標準旗手" : lang === "ko" ? "표준기장" : "Standard Bearer";
        case ("agent"): return lang === "zh" ? "特工" : lang === "ja" ? "特工" : lang === "ko" ? "특공대" : "Agent";

        //caster 7 total
        case ("corecaster"): return lang === "zh" ? "核心术师" : lang === "ja" ? "核心術師" : lang === "ko" ? "핵심마비" : "Core Caster";
        case ("splashcaster"): return lang === "zh" ? "范围术师" : lang === "ja" ? "範囲術師" : lang === "ko" ? "범위마비" : "Splash Caster";
        case ("funnel"): return lang === "zh" ? "机械共鸣术师" : lang === "ja" ? "機械共鳴術師" : lang === "ko" ? "기계공명마비" : "Mech-accord Caster";
        case ("phalanx"): return lang === "zh" ? "方阵术师" : lang === "ja" ? "方陣術師" : lang === "ko" ? "방진마비" : "Phalanx Caster";
        case ("mystic"): return lang === "zh" ? "神秘术师" : lang === "ja" ? "神秘術師" : lang === "ko" ? "신비마비" : "Mystic Caster";
        case ("chain"): return lang === "zh" ? "连锁术师" : lang === "ja" ? "連鎖術師" : lang === "ko" ? "연쇄마비" : "Chain Caste";
        case ("blastcaster"): return lang === "zh" ? "爆炸术师" : lang === "ja" ? "爆発術師" : lang === "ko" ? "폭발마비" : "Blast Caster";
        case ("primcaster"): return lang === "zh" ? "原始术师" : lang === "ja" ? "原始術師" : lang === "ko" ? "원시마비" : "Primal Caster";

        //supporter 7 total
        case ("summoner"): return lang === "zh" ? "召唤者" : lang === "ja" ? "召喚者" : lang === "ko" ? "소환자" : "Summoner";
        case ("underminer"): return lang === "zh" ? "诅咒者" : lang === "ja" ? "呪術者" : lang === "ko" ? "저주자" : "Hexer";
        case ("slower"): return lang === "zh" ? "减速者" : lang === "ja" ? "減速者" : lang === "ko" ? "감속자" : "Decel Binder";
        case ("craftsman"): return lang === "zh" ? "工匠" : lang === "ja" ? "工芸師" : lang === "ko" ? "공예사" : "Artificer";
        case ("bard"): return lang === "zh" ? "吟游诗人" : lang === "ja" ? "吟遊詩人" : lang === "ko" ? "음악사" : "Bard";
        case ("blessing"): return lang === "zh" ? "祝福者" : lang === "ja" ? "祝福者" : lang === "ko" ? "축복자" : "Abjurer";
        case ("ritualist"): return lang === "zh" ? "仪式者" : lang === "ja" ? "儀式者" : lang === "ko" ? "의식자" : "Ritualist";

        default : return "";
    }
}

function getGender(name){
    var charInfo = profileData.handbookDict[name]
    if(charInfo){
        var currinfo = charInfo.storyTextAudio[0].stories[0].storyText.split("\n")[1].split("【性别】")[1]
        return currinfo
    }
    return null
}

function getGenderEN(gender){
    if (typeof gender === 'string') {
        const trimmedGender = gender.trim();

        switch(trimmedGender) {
            case "男": return "Male";
            case "女": return "Female";
            default: return "Unknown";
        }
    } else {
        return "Unknown";
    }
}

function getGenderJP(gender){
    if (typeof gender === 'string') {
        const trimmedGender = gender.trim();

        switch(trimmedGender){
            case ("男"): return "男";
            case ("女"): return "女性";
            default: return "Unknown"; 
        }
    } else {
        return "Unknown";
    }
}

function getGenderKo(gender){
    if (typeof gender === 'string') {
        const trimmedGender = gender.trim();

        switch(trimmedGender){
            case ("男"): return "남성";
            case ("女"): return "여성";
            default: return "Unknown";
        }
    } else {
        return "Unknown";
    }
}

updatedGameData.sort((a, b) => parseInt(b.rarity) - parseInt(a.rarity));


console.log(updatedGameData[0].skillsid.skill1Lvlup7);
fs.writeFile(gameDataFilePath, JSON.stringify(updatedGameData, null, '\t'), (err) => {
    if (err) {
        console.error('Error writing file in charDataScript:', err);
    } else {
        console.log('Successfully wrote data to file in charDataScript.');
    }
})
