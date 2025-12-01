import { Sparkles, Heart, Users, Code, Zap } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <Sparkles className="h-12 w-12 text-amber-400 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-slate-100 mb-4">Über AddOnForge</h1>
        <p className="text-xl text-slate-300">
          Eine Community-Plattform für World of Warcraft AddOn-Anfragen
        </p>
      </div>

      <div className="wow-card p-8 mb-8">
        <h2 className="text-2xl font-bold text-slate-100 mb-4 flex items-center gap-2">
          <Heart className="h-6 w-6 text-amber-500" />
          Unsere Mission
        </h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          Mit der Ankündigung von World of Warcraft: Midnight und der Einstellung von WeakAuras
          entsteht eine Lücke in der WoW-Community. WeakAuras war eines der beliebtesten AddOns
          und bot unglaubliche Möglichkeiten zur Personalisierung des Spielerlebnisses.
        </p>
        <p className="text-slate-300 leading-relaxed">
          AddOnForge wurde geschaffen, um diese Lücke zu füllen und der Community eine Plattform
          zu bieten, auf der sie ihre AddOn-Wünsche teilen, diskutieren und deren Entwicklung
          verfolgen können.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="wow-card p-6">
          <Users className="h-8 w-8 text-amber-500 mb-3" />
          <h3 className="text-xl font-bold text-slate-100 mb-2">Community-getrieben</h3>
          <p className="text-slate-400">
            Die besten Ideen kommen von der Community. Stimme für deine Favoriten ab und
            diskutiere mit anderen Spielern.
          </p>
        </div>

        <div className="wow-card p-6">
          <Code className="h-8 w-8 text-amber-500 mb-3" />
          <h3 className="text-xl font-bold text-slate-100 mb-2">Transparent</h3>
          <p className="text-slate-400">
            Verfolge den Entwicklungsfortschritt deiner Anfragen in Echtzeit. Alle Anfragen
            sind öffentlich einsehbar.
          </p>
        </div>

        <div className="wow-card p-6">
          <Zap className="h-8 w-8 text-amber-500 mb-3" />
          <h3 className="text-xl font-bold text-slate-100 mb-2">Schnell & Modern</h3>
          <p className="text-slate-400">
            Gebaut mit modernen Technologien für eine schnelle und angenehme Benutzererfahrung.
          </p>
        </div>

        <div className="wow-card p-6">
          <Heart className="h-8 w-8 text-amber-500 mb-3" />
          <h3 className="text-xl font-bold text-slate-100 mb-2">Open Source</h3>
          <p className="text-slate-400">
            AddOnForge ist ein Open-Source-Projekt. Jeder kann beitragen und die Plattform
            verbessern.
          </p>
        </div>
      </div>

      <div className="wow-card p-8">
        <h2 className="text-2xl font-bold text-slate-100 mb-4">Wie funktioniert es?</h2>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-slate-900 font-bold">
              1
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-200 mb-1">Anfrage erstellen</h3>
              <p className="text-slate-400">
                Beschreibe deine Idee für ein AddOn. Was soll es können? Welches Problem löst es?
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-slate-900 font-bold">
              2
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-200 mb-1">Community-Voting</h3>
              <p className="text-slate-400">
                Die Community stimmt für die besten Ideen. Beliebte Anfragen werden priorisiert.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-slate-900 font-bold">
              3
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-200 mb-1">Entwicklung</h3>
              <p className="text-slate-400">
                Entwickler arbeiten an den Anfragen. Der Status wird transparent kommuniziert.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-slate-900 font-bold">
              4
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-200 mb-1">Veröffentlichung</h3>
              <p className="text-slate-400">
                Fertige AddOns werden veröffentlicht und stehen zum Download bereit.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

