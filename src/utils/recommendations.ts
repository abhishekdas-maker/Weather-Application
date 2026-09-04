import { CurrentWeatherState, DailyForecastItem, WeatherIntelligence, ActivityScore, ClothingRecommendation } from '../types';

export function generateWeatherIntelligence(
  current: CurrentWeatherState,
  todayForecast?: DailyForecastItem
): WeatherIntelligence {
  const temp = current.temperature;
  const feelsLike = current.apparentTemperature;
  const wind = current.windSpeed;
  const uv = current.uvIndex ?? (todayForecast ? todayForecast.uvIndexMax : 0);
  const precipProb = todayForecast ? todayForecast.precipitationProbabilityMax : (current.precipitation > 0 ? 80 : 10);
  const isRaining = [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99].includes(current.weatherCode);
  const isSnowing = [71, 73, 75, 77, 85, 86].includes(current.weatherCode);
  const isThunder = [95, 96, 99].includes(current.weatherCode);

  // 1. Clothing Formulation
  let top = 'Casual breathable cotton T-shirt or short-sleeve button-down';
  let bottom = 'Breathable lightweight trousers or casual shorts';
  let outerwear = 'None required';
  let footwear = 'Comfortable everyday sneakers or walking shoes';
  const accessories: string[] = [];
  let alert: string | undefined = undefined;

  if (feelsLike < 0) {
    top = 'Thermal base-layer + thick wool knit sweater';
    bottom = 'Insulated thermal underlayer + heavyweight fleece-lined pants';
    outerwear = 'Sub-zero down parka with sealed storm-hood';
    footwear = 'Waterproof insulated boots with high-traction winter tread';
    accessories.push('Thermal knit beanie', 'Insulated winter gloves', 'Wool neck scarf');
    alert = 'Freezing wind-chill. Keep exposed skin covered to prevent frostbite.';
  } else if (feelsLike < 8) {
    top = 'Thermal long-sleeve + medium-weight fleece or cable-knit sweater';
    bottom = 'Heavy cotton denim, corduroys, or wool-blend trousers';
    outerwear = 'Insulated wool overcoat, trench coat, or mid-weight puffer jacket';
    footwear = 'Sturdy leather boots or warm closed-toe shoes';
    accessories.push('Knit beanie or ear warmer', 'Light leather/fleece gloves');
  } else if (feelsLike < 16) {
    top = 'Comfortable long-sleeve tee, cotton pullover, or casual crewneck';
    bottom = 'Classic denim jeans, chinos, or comfortable joggers';
    outerwear = isRaining ? 'Waterproof rain jacket with taped seams' : (wind > 20 ? 'Windproof utility jacket or bomber' : 'Light denim or chore jacket');
    footwear = isRaining ? 'Water-resistant sneakers or Chelsea boots' : 'Standard sneakers or casual loafers';
  } else if (feelsLike < 24) {
    top = 'Crisp cotton t-shirt, relaxed polo, or linen long-sleeve';
    bottom = 'Breathable lightweight chinos, casual pants, or relaxed denim';
    outerwear = isRaining ? 'Light packable rain shell' : (wind > 25 ? 'Light windbreaker' : 'Optional cardigan or overshirt for evening breeze');
    footwear = 'Breathable canvas sneakers or casual slip-ons';
  } else if (feelsLike < 32) {
    top = 'Lightweight, moisture-wicking tee, tank, or airy linen shirt';
    bottom = 'Tailored linen shorts, light cotton chinos, or breezy skirt';
    outerwear = isRaining ? 'Ultra-light water-resistant shell' : 'No outer layers needed';
    footwear = 'Cushioned athletic sneakers, breathable espadrilles, or sandals';
  } else {
    top = 'Ultra-light, loose-fitting, light-colored cotton or linen';
    bottom = 'Ventilated athletic shorts or airy linen trousers';
    outerwear = 'None; prioritize heat dissipation and ventilation';
    footwear = 'Perforated running shoes, open sandals, or breathable slides';
    alert = 'Intense heat advisory. Hydrate frequently and seek shade during peak solar hours.';
  }

  // Rain adjustments
  if (isRaining || precipProb > 50) {
    accessories.push('Wind-resistant travel umbrella');
    if (!footwear.includes('Water') && !footwear.includes('boot')) {
      footwear = 'Water-resistant footwear or treated sneakers';
    }
  }

  // Snow adjustments
  if (isSnowing) {
    accessories.push('Waterproof thermal gloves', 'Warm knit beanie');
    footwear = 'Grip-traction winter boots';
  }

  // UV protection
  if (uv >= 6) {
    accessories.push('Polarized UV-400 sunglasses', 'SPF 50+ broad-spectrum sunscreen', 'Wide-brim sun hat');
  } else if (uv >= 3) {
    accessories.push('UV-blocking sunglasses', 'SPF 30+ daily sunscreen');
  }

  // Wind accessories
  if (wind > 35 && !accessories.includes('Windbreaker')) {
    accessories.push('Wind-resistant outer barrier');
  }

  const clothing: ClothingRecommendation = {
    summary: `${feelsLike < 12 ? 'Layered & Insulated' : feelsLike < 22 ? 'Versatile & Comfortable' : 'Breezy & Lightweight'} Outfit Recommended`,
    top,
    bottom,
    outerwear,
    footwear,
    accessories,
    alert,
  };

  // 2. Activity Suitability Engine
  const activities: ActivityScore[] = [];

  // Running & Jogging
  let runScore = 95;
  let runReason = 'Near-perfect thermal conditions for outdoor cardio.';
  if (feelsLike > 28) {
    runScore -= Math.min(50, (feelsLike - 28) * 8);
    runReason = 'High ambient heat elevates dehydration risk; run early morning or dusk.';
  } else if (feelsLike < 3) {
    runScore -= Math.min(45, (3 - feelsLike) * 6);
    runReason = 'Cold air may restrict breathing; wear a thermal gaiter and warm up indoors.';
  }
  if (isRaining) {
    runScore -= 30;
    runReason = 'Slick pavement and lowered traction. Wet clothing reduces core warmth.';
  }
  if (isThunder) {
    runScore = 10;
    runReason = 'Hazardous lightning warning; shift running sessions indoors.';
  }
  if (wind > 30) {
    runScore -= 20;
    runReason = 'Headwinds require elevated stamina and reduce running pace.';
  }
  runScore = Math.max(10, Math.min(100, Math.round(runScore)));
  activities.push({
    name: 'Running & Jogging',
    score: runScore,
    label: getScoreLabel(runScore),
    reason: runReason,
    icon: 'Activity',
  });

  // Cycling & Commute
  let bikeScore = 90;
  let bikeReason = 'Clear roads and manageable wind make cycling smooth.';
  if (wind > 35) {
    bikeScore -= 45;
    bikeReason = 'Strong crosswinds and gusts significantly compromise bike stability.';
  } else if (wind > 20) {
    bikeScore -= 18;
    bikeReason = 'Brisk headwinds will require extra gear effort.';
  }
  if (isRaining) {
    bikeScore -= 40;
    bikeReason = 'Wet braking distances double and road markings become slippery.';
  }
  if (isSnowing || [56, 57, 66, 67].includes(current.weatherCode)) {
    bikeScore = 15;
    bikeReason = 'Extreme slip and ice hazards on bike lanes.';
  }
  if (isThunder) {
    bikeScore = 5;
    bikeReason = 'Severe storm danger; avoid open bicycle commuting.';
  }
  bikeScore = Math.max(5, Math.min(100, Math.round(bikeScore)));
  activities.push({
    name: 'Cycling & Commuting',
    score: bikeScore,
    label: getScoreLabel(bikeScore),
    reason: bikeReason,
    icon: 'Bike',
  });

  // Outdoor Dining & Patios
  let diningScore = 92;
  let diningReason = 'Pleasant temperatures and calm air are ideal for open-air seating.';
  if (feelsLike < 14) {
    diningScore -= (14 - feelsLike) * 7;
    diningReason = 'Too chilly for extended patio dining without dedicated heat lamps.';
  } else if (feelsLike > 31) {
    diningScore -= (feelsLike - 31) * 7;
    diningReason = 'Oppressive heat will make patio dining uncomfortable without misting.';
  }
  if (isRaining || precipProb > 40) {
    diningScore -= 45;
    diningReason = 'High risk of rain interruption; reserve indoor or covered tables.';
  }
  if (wind > 25) {
    diningScore -= 25;
    diningReason = 'Breezy winds may blow away napkins, cutlery, and glassware.';
  }
  diningScore = Math.max(10, Math.min(100, Math.round(diningScore)));
  activities.push({
    name: 'Outdoor Dining & Patios',
    score: diningScore,
    label: getScoreLabel(diningScore),
    reason: diningReason,
    icon: 'Coffee',
  });

  // Walking & Sightseeing
  let walkScore = 95;
  let walkReason = 'Great weather for urban exploring and neighbourhood walks.';
  if (isRaining) {
    walkScore -= 25;
    walkReason = 'Walkable with a sturdy umbrella and water-resistant shoes.';
  }
  if (feelsLike < 0 || feelsLike > 33) {
    walkScore -= 30;
    walkReason = 'Limit continuous exposure; schedule regular indoor rest breaks.';
  }
  if (isThunder) {
    walkScore = 15;
    walkReason = 'Atmospheric electrical storms; stay near sheltered areas.';
  }
  walkScore = Math.max(15, Math.min(100, Math.round(walkScore)));
  activities.push({
    name: 'Walking & City Walks',
    score: walkScore,
    label: getScoreLabel(walkScore),
    reason: walkReason,
    icon: 'Footprints',
  });

  // 3. Comfort Index Calculation
  let comfortIndex = 85;
  if (feelsLike < 5) comfortIndex -= (5 - feelsLike) * 4;
  else if (feelsLike > 26) comfortIndex -= (feelsLike - 26) * 4;
  if (current.relativeHumidity > 75) comfortIndex -= 10;
  if (isRaining) comfortIndex -= 15;
  if (wind > 30) comfortIndex -= 12;
  comfortIndex = Math.max(15, Math.min(100, Math.round(comfortIndex)));

  let comfortLabel = 'Optimal';
  if (comfortIndex < 40) comfortLabel = 'Harsh';
  else if (comfortIndex < 60) comfortLabel = 'Moderate';
  else if (comfortIndex < 80) comfortLabel = 'Comfortable';

  // 4. Tactical General Advice Narrative
  let generalAdvice = '';
  if (isThunder) {
    generalAdvice = 'Severe storm conditions detected. Postpone non-essential travel and secure outdoor items.';
  } else if (isSnowing) {
    generalAdvice = 'Expect snowy surfaces and reduced visibility. Allow extra transit time and wear slip-resistant boots.';
  } else if (isRaining) {
    generalAdvice = `Rainfall expected with ${Math.round(precipProb)}% chance. Keep an umbrella within reach and anticipate wet roadways.`;
  } else if (temp > 28) {
    generalAdvice = `Warm summer heat at ${Math.round(temp)}°C. Plan high-exertion routines for early hours and maintain continuous hydration.`;
  } else if (temp < 5) {
    generalAdvice = `Brisk chill at ${Math.round(temp)}°C. Dress in multiple layers to adapt effortlessly between indoor and outdoor transitions.`;
  } else {
    generalAdvice = `Favorable conditions at ${Math.round(temp)}°C. A balanced day well suited for both commute and outdoor leisure.`;
  }

  return {
    clothing,
    activities,
    generalAdvice,
    comfortIndex,
    comfortLabel,
  };
}

function getScoreLabel(score: number): ActivityScore['label'] {
  if (score >= 85) return 'Ideal';
  if (score >= 70) return 'Good';
  if (score >= 50) return 'Fair';
  if (score >= 30) return 'Challenging';
  return 'Not Recommended';
}
