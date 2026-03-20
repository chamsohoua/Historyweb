// src/components/content/FactsScreen.jsx
import { useTranslation } from '../../i18n/LangContext';
import { useContent }     from '../../hooks/useContent';

export default function FactsScreen() {
  const { t } = useTranslation();
  const { data: factsData } = useContent('facts', null);

  const DEFAULT_FACT_CATEGORIES = [
    {
      titleKey: 'facts.cat.geo',     icon: '🌍', color: 'var(--sky-dark)',
      facts: [
        { labelKey:'facts.geo.area',       value:'2,381,741', unit:'km²',   noteKey:'facts.geo.area.note'       },
        { labelKey:'facts.geo.coast',      value:'1,200',     unit:'km',    noteKey:'facts.geo.coast.note'      },
        { labelKey:'facts.geo.sahara',     value:'85',        unit:'%',     noteKey:'facts.geo.sahara.note'     },
        { labelKey:'facts.geo.peak',       value:'3,003',     unit:'m',     noteKey:'facts.geo.peak.note'       },
        { labelKey:'facts.geo.neighbors',  value:'7',         unit:'',      noteKey:'facts.geo.neighbors.note'  },
        { labelKey:'facts.geo.wilayas',    value:'48',        unit:'',      noteKey:'facts.geo.wilayas.note'    },
      ],
    },
    {
      titleKey: 'facts.cat.people',  icon: '👥', color: 'var(--purple)',
      facts: [
        { labelKey:'facts.pop.total',      value:'47,000,000', unit:'+',   noteKey:'facts.pop.total.note'   },
        { labelKey:'facts.pop.youth',      value:'70',         unit:'%',   noteKey:'facts.pop.youth.note'   },
        { labelKey:'facts.pop.literacy',   value:'81',         unit:'%',   noteKey:'facts.pop.literacy.note'},
        { labelKey:'facts.pop.students',   value:'1,800,000',  unit:'+',   noteKey:'facts.pop.students.note'},
        { labelKey:'facts.pop.languages',  value:'3',          unit:'',    noteKey:'facts.pop.languages.note'},
        { labelKey:'facts.pop.capital',    value:'3,500,000',  unit:'+',   noteKey:'facts.pop.capital.note' },
      ],
    },
    {
      titleKey: 'facts.cat.history', icon: '🔥', color: 'var(--coral-dark)',
      facts: [
        { labelKey:'facts.hist.colonial',  value:'132',      unit:'yrs',  noteKey:'facts.hist.colonial.note'  },
        { labelKey:'facts.hist.revolution',value:'7.5',      unit:'yrs',  noteKey:'facts.hist.revolution.note'},
        { labelKey:'facts.hist.martyrs',   value:'1,500,000',unit:'+',    noteKey:'facts.hist.martyrs.note'   },
        { labelKey:'facts.hist.attacks',   value:'70',       unit:'',     noteKey:'facts.hist.attacks.note'   },
        { labelKey:'facts.hist.referendum',value:'99.72',    unit:'%',    noteKey:'facts.hist.referendum.note'},
        { labelKey:'facts.hist.years',     value:'62',       unit:'yrs',  noteKey:'facts.hist.years.note'     },
      ],
    },
    {
      titleKey: 'facts.cat.economy', icon: '🛢️', color: 'var(--yellow-dark)',
      facts: [
        { labelKey:'facts.eco.gas',        value:'4,504',    unit:'bcm',  noteKey:'facts.eco.gas.note'       },
        { labelKey:'facts.eco.oil',        value:'12.2',     unit:'Bbbl', noteKey:'facts.eco.oil.note'       },
        { labelKey:'facts.eco.sonatrach',  value:'#1',       unit:'',     noteKey:'facts.eco.sonatrach.note' },
        { labelKey:'facts.eco.gdp',        value:'190',      unit:'B$',   noteKey:'facts.eco.gdp.note'       },
        { labelKey:'facts.eco.dates',      value:'1,000,000',unit:'t/yr', noteKey:'facts.eco.dates.note'     },
        { labelKey:'facts.eco.phosphate',  value:'Top 5',    unit:'',     noteKey:'facts.eco.phosphate.note' },
      ],
    },
    {
      titleKey: 'facts.cat.culture', icon: '🏺', color: 'var(--orange-dark)',
      facts: [
        { labelKey:'facts.cul.unesco',     value:'7',        unit:'',     noteKey:'facts.cul.unesco.note'    },
        { labelKey:'facts.cul.paintings',  value:'15,000+',  unit:'',     noteKey:'facts.cul.paintings.note' },
        { labelKey:'facts.cul.holidays',   value:'9',        unit:'',     noteKey:'facts.cul.holidays.note'  },
        { labelKey:'facts.cul.rai',        value:'Oran',     unit:'',     noteKey:'facts.cul.rai.note'       },
        { labelKey:'facts.cul.olympics',   value:'5',        unit:'',     noteKey:'facts.cul.olympics.note'  },
        { labelKey:'facts.cul.dialects',   value:'30+',      unit:'',     noteKey:'facts.cul.dialects.note'  },
      ],
    },
  ];

  const FACT_CATEGORIES = factsData?.categories?.length ? factsData.categories : DEFAULT_FACT_CATEGORIES;

  const JOURNEY = [
    { year:'~8000 BC', labelKey:'facts.journey.paintings', icon:'🦣' },
    { year:'202 BC',   labelKey:'facts.journey.numidia',   icon:'👑' },
    { year:'670 AD',   labelKey:'facts.journey.islamic',   icon:'☪️'  },
    { year:'1516',     labelKey:'facts.journey.ottoman',   icon:'🕌'  },
    { year:'1830',     labelKey:'facts.journey.invasion',  icon:'⚔️'  },
    { year:'1954',     labelKey:'facts.journey.revolution',icon:'🔥'  },
    { year:'1962',     labelKey:'facts.journey.independence',icon:'🌟'},
    { year:'2026',     labelKey:'facts.journey.today',     icon:'🇩🇿' },
  ];

  return (
    <div style={{ background:'var(--bg-page)', minHeight:'100vh', padding:'var(--sp-12) var(--sp-8)' }}>
      <div style={{ maxWidth:'1200px', margin:'0 auto' }}>

        {/* Header */}
        <div style={{ textAlign:'center', marginBottom:'var(--sp-12)' }}>
          <div style={{ fontSize:'4rem', marginBottom:'var(--sp-4)', animation:'float 3s ease-in-out infinite' }}>📊</div>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(2rem,5vw,3.5rem)', color:'var(--ink)', marginBottom:'var(--sp-3)' }}>
            {t('facts.title')}
          </h1>
          <p style={{ color:'var(--ink-mid)', fontSize:'1.05rem', maxWidth:'500px', margin:'0 auto' }}>
            {t('facts.sub')}
          </p>
          <hr style={{ maxWidth:'200px', margin:'var(--sp-6) auto 0', border:'none', height:'4px', background:'repeating-linear-gradient(90deg,var(--green-mid) 0,var(--green-mid) 12px,var(--yellow) 12px,var(--yellow) 24px)', borderRadius:'4px' }}/>
        </div>

        {/* Fact Categories */}
        {FACT_CATEGORIES.map((cat, ci) => (
          <div key={ci} className="anim-slide-up" style={{ animationDelay:`${ci*0.1}s`, marginBottom:'var(--sp-10)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'var(--sp-3)', marginBottom:'var(--sp-5)' }}>
              <div style={{ width:'48px', height:'48px', background:'var(--bg-raised)', border:`3px solid var(--border-mid)`, borderRadius:'var(--r-lg)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.5rem', animation:'float 4s ease-in-out infinite', flexShrink:0 }}>
                {cat.icon}
              </div>
              <h2 style={{ fontFamily:'var(--font-display)', fontSize:'1.5rem', color:cat.color }}>
                {t(cat.titleKey)}
              </h2>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'var(--sp-4)' }}>
              {cat.facts.map((f, i) => (
                <div key={i} className="card" style={{ padding:'var(--sp-5) var(--sp-6)', position:'relative', overflow:'hidden' }}>
                  <div style={{ fontFamily:'var(--font-display)', fontSize:'clamp(1.5rem,4vw,2.5rem)', fontWeight:800, color:cat.color, lineHeight:1, marginBottom:'4px' }}>
                    {f.value}<span style={{ fontSize:'1rem', opacity:0.7, marginLeft:'4px' }}>{f.unit}</span>
                  </div>
                  <div style={{ fontFamily:'var(--font-body)', fontWeight:700, fontSize:'0.88rem', color:'var(--ink)', marginBottom:'6px' }}>
                    {t(f.labelKey)}
                  </div>
                  <div style={{ fontSize:'0.75rem', color:'var(--ink-light)', lineHeight:1.5 }}>
                    {t(f.noteKey)}
                  </div>
                  <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'4px', background:`linear-gradient(90deg,${cat.color},transparent)` }}/>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Timeline journey strip */}
        <div style={{ background:'var(--bg-surface)', border:'3px solid var(--border)', borderRadius:'var(--r-2xl)', padding:'var(--sp-8)', marginTop:'var(--sp-10)' }}>
          <h3 style={{ fontFamily:'var(--font-display)', color:'var(--ink)', marginBottom:'var(--sp-6)', textAlign:'center', fontSize:'1.4rem' }}>
            {t('facts.journey.title')}
          </h3>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'var(--sp-4)' }}>
            {JOURNEY.map((item, i) => (
              <div key={i} style={{ textAlign:'center', animation:`float ${3+i*0.3}s ease-in-out infinite`, animationDelay:`${i*0.2}s`, flex:'1 1 80px' }}>
                <div style={{ fontSize:'2rem', marginBottom:'6px' }}>{item.icon}</div>
                <div style={{ fontFamily:'var(--font-display)', fontSize:'0.78rem', color:'var(--green-mid)', fontWeight:800 }}>{item.year}</div>
                <div style={{ fontSize:'0.68rem', color:'var(--ink-light)', marginTop:'2px' }}>{t(item.labelKey)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
